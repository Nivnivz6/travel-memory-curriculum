const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock external services BEFORE requiring the app
jest.mock('aws-sdk');
jest.mock('amqplib');

const app = require('../src/app');
const User = require('../src/models/User');
const { mockUpload } = require('aws-sdk');

// We need to set up the RabbitMQ channel mock before tests run
const { connectRabbitMQ } = require('../src/config/rabbitmq');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Initialize the mocked RabbitMQ connection/channel
  await connectRabbitMQ();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  // Clear mock call history between tests
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Image Endpoints', () => {
  let testUser;
  let token;

  beforeEach(async () => {
    // Create a test user for image uploads
    testUser = await User.create({
      username: 'imageuser',
      email: 'imageuser@example.com',
      password: 'testpassword123',
    });

    const jwt = require('jsonwebtoken');
    token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET || 'fallback_secret');
  });

  describe('POST /api/images/upload', () => {
    it('should upload an image and return 201', async () => {
      const res = await request(app)
        .post('/api/images/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', Buffer.from('fake-image-data'), 'test-image.jpg');

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.filename).toBe('test-image.jpg');
      expect(res.body.s3Key).toBe('uploads/test-image.jpg');
      expect(res.body.s3Url).toBe(
        'http://localhost:9000/learning-uploads/uploads/test-image.jpg'
      );
      expect(res.body.status).toBe('pending');
      expect(res.body.userId).toBe(testUser._id.toString());
    });

    it('should call S3 upload when uploading an image', async () => {
      await request(app)
        .post('/api/images/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', Buffer.from('fake-image-data'), 'test-image.jpg');

      expect(mockUpload).toHaveBeenCalled();
      const uploadArgs = mockUpload.mock.calls[0][0];
      expect(uploadArgs).toHaveProperty('Bucket');
      expect(uploadArgs).toHaveProperty('Key');
      expect(uploadArgs).toHaveProperty('Body');
    });

    it('should publish a message to RabbitMQ when uploading', async () => {
      const amqplib = require('amqplib');
      const { mockChannel } = amqplib;

      await request(app)
        .post('/api/images/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', Buffer.from('fake-image-data'), 'test-image.jpg');

      expect(mockChannel.assertQueue).toHaveBeenCalledWith('image-processing', {
        durable: true,
      });
      expect(mockChannel.sendToQueue).toHaveBeenCalled();

      // Verify the message payload
      const sentBuffer = mockChannel.sendToQueue.mock.calls[0][1];
      const message = JSON.parse(sentBuffer.toString());
      expect(message).toHaveProperty('imageId');
      expect(message).toHaveProperty('s3Key');
      expect(message.action).toBe('process-image');
    });

    it('should return 400 when no file is uploaded', async () => {
      const res = await request(app)
        .post('/api/images/upload')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/images', () => {
    it('should return all images for the authenticated user', async () => {
      // Seed an image directly in DB
      const Image = require('../src/models/Image');
      await Image.create({
        userId: testUser._id,
        filename: 'test.jpg',
        s3Key: 'uploads/test.jpg',
        s3Url: 'http://localhost:9000/learning-uploads/test.jpg',
        status: 'pending',
      });

      const res = await request(app)
        .get('/api/images')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].filename).toBe('test.jpg');
    });

    it('should strictly enforce Data Isolation (Tenant Isolation)', async () => {
      // 1. User A (testUser) uploads an image
      const Image = require('../src/models/Image');
      await Image.create({
        userId: testUser._id,
        filename: 'user-a-private.jpg',
        s3Key: 'uploads/user-a-private.jpg',
        s3Url: 'http://localhost:9000/learning-uploads/user-a-private.jpg',
        status: 'pending',
      });

      // 2. Create User B
      const userB = await User.create({
        username: 'isolateduser',
        email: 'isolateduser@example.com',
        password: 'testpassword123',
      });

      // 3. Generate Token for User B
      const jwt = require('jsonwebtoken');
      const tokenB = jwt.sign({ id: userB._id }, process.env.JWT_SECRET || 'fallback_secret');

      // 4. User B attempts to fetch their gallery
      const res = await request(app)
        .get('/api/images')
        .set('Authorization', `Bearer ${tokenB}`);
      
      // 5. Assert User B sees NOTHING, completely isolated from User A's data
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it('should return empty array when no images exist', async () => {
      const res = await request(app)
        .get('/api/images')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  describe('GET /api/images/:id', () => {
    it('should return an image by ID', async () => {
      const Image = require('../src/models/Image');
      const image = await Image.create({
        userId: testUser._id,
        filename: 'test.jpg',
        s3Key: 'uploads/test.jpg',
        s3Url: 'http://localhost:9000/learning-uploads/test.jpg',
        status: 'processed',
      });

      const res = await request(app)
        .get(`/api/images/${image._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.filename).toBe('test.jpg');
      expect(res.body.status).toBe('processed');
    });

    it('should return 404 for non-existent image', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/images/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 404 for invalid ObjectId', async () => {
      const res = await request(app)
        .get('/api/images/invalidid123')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
