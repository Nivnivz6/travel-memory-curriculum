const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock ioredis before anything else
jest.mock('ioredis');

// Mock amqplib and aws-sdk so image routes don't fail
jest.mock('amqplib');
jest.mock('aws-sdk');

const app = require('../src/app');
const MockIoRedis = require('ioredis');
const Image = require('../src/models/Image');
const User = require('../src/models/User');

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
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Redis Cache Middleware', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await User.create({
      username: 'cacheuser',
      email: 'cache@example.com',
    });

    await Image.create({
      userId: testUser._id,
      filename: 'cached.jpg',
      s3Key: 'uploads/cached.jpg',
      s3Url: 'http://localhost:9000/learning-uploads/cached.jpg',
      status: 'processed',
    });
  });

  it('should return data from database on cache miss', async () => {
    // Redis get returns null (cache miss)
    MockIoRedis.mockRedis.get.mockResolvedValueOnce(null);

    const res = await request(app).get('/api/images');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].filename).toBe('cached.jpg');

    // Verify Redis get was called
    expect(MockIoRedis.mockRedis.get).toHaveBeenCalled();

    // Verify the result was cached via setex
    expect(MockIoRedis.mockRedis.setex).toHaveBeenCalled();
  });

  it('should return cached data on cache hit', async () => {
    const cachedData = [
      {
        _id: 'cached-id',
        filename: 'from-cache.jpg',
        s3Key: 'uploads/from-cache.jpg',
        s3Url: 'http://localhost:9000/learning-uploads/from-cache.jpg',
        status: 'processed',
      },
    ];

    // Redis get returns cached data (cache hit)
    MockIoRedis.mockRedis.get.mockResolvedValueOnce(
      JSON.stringify(cachedData)
    );

    const res = await request(app).get('/api/images');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].filename).toBe('from-cache.jpg');

    // setex should NOT be called on a cache hit
    expect(MockIoRedis.mockRedis.setex).not.toHaveBeenCalled();
  });
});
