jest.mock('amqplib');

const amqplib = require('amqplib');
const { mockChannel } = amqplib;
const { connectRabbitMQ } = require('../src/config/rabbitmq');
const { publishMessage } = require('../src/services/queueService');

beforeAll(async () => {
  // Initialize the mock connection/channel
  await connectRabbitMQ();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Queue Service', () => {
  it('should publish a message to the image-processing queue', async () => {
    const message = {
      imageId: '12345',
      s3Key: 'uploads/test.jpg',
      action: 'process-image',
    };

    await publishMessage(message);

    expect(mockChannel.assertQueue).toHaveBeenCalledWith('image-processing', {
      durable: true,
    });
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      'image-processing',
      expect.any(Buffer),
      { persistent: true }
    );

    // Verify the message content
    const sentBuffer = mockChannel.sendToQueue.mock.calls[0][1];
    const parsed = JSON.parse(sentBuffer.toString());
    expect(parsed).toEqual(message);
  });

  it('should handle different message payloads', async () => {
    const message = {
      imageId: '67890',
      s3Key: 'uploads/another.png',
      action: 'process-image',
    };

    await publishMessage(message);

    const sentBuffer = mockChannel.sendToQueue.mock.calls[0][1];
    const parsed = JSON.parse(sentBuffer.toString());
    expect(parsed.imageId).toBe('67890');
    expect(parsed.s3Key).toBe('uploads/another.png');
  });
});
