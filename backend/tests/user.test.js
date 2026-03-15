const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Endpoints', () => {
  describe('POST /api/users', () => {
    it('should create a new user and return 201', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ username: 'testuser', email: 'test@example.com', password: 'testpassword' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.username).toBe('testuser');
      expect(res.body.email).toBe('test@example.com');
    });

    it('should return 400 when username is missing', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ email: 'test@example.com', password: 'testpassword' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 when email is missing', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ username: 'testuser', password: 'testpassword' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for duplicate username', async () => {
      await request(app)
        .post('/api/users')
        .send({ username: 'testuser', email: 'test1@example.com', password: 'testpassword' });

      const res = await request(app)
        .post('/api/users')
        .send({ username: 'testuser', email: 'test2@example.com', password: 'testpassword' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by ID', async () => {
      const createRes = await request(app)
        .post('/api/users')
        .send({ username: 'testuser', email: 'test@example.com', password: 'testpassword' });

      const res = await request(app).get(`/api/users/${createRes.body._id}`);

      expect(res.status).toBe(200);
      expect(res.body.username).toBe('testuser');
      expect(res.body.email).toBe('test@example.com');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/users/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 404 for invalid ObjectId', async () => {
      const res = await request(app).get('/api/users/invalidid123');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
