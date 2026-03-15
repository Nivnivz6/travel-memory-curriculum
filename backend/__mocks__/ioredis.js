const mockRedis = {
  get: jest.fn().mockResolvedValue(null),
  setex: jest.fn().mockResolvedValue('OK'),
  set: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue(1),
  quit: jest.fn().mockResolvedValue('OK'),
  on: jest.fn(),
  connect: jest.fn().mockResolvedValue(undefined),
};

class MockIoRedis {
  constructor() {
    return mockRedis;
  }
}

// Attach the mock instance for test access
MockIoRedis.mockRedis = mockRedis;

module.exports = MockIoRedis;
