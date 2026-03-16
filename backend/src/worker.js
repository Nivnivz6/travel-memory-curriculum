require('dotenv').config();
const mongoose = require('mongoose');
const amqplib = require('amqplib');
const Image = require('./models/Image');
const { getRedisClient } = require('./config/redis');

const QUEUE_NAME = 'image-processing';

const startWorker = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Worker connected to MongoDB');

    // Connect to RabbitMQ
    const connection = await amqplib.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`Worker listening on queue: "${QUEUE_NAME}"`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        console.log('Received message:', data);

        try {
          // Simulate image processing (e.g., resizing, thumbnail generation)
          console.log(`Processing image: ${data.imageId}`);

          // Update image status in MongoDB
          await Image.findByIdAndUpdate(data.imageId, {
            status: 'processed',
          });

          // Invalidate cache for the image owner (boilerplate provided)
          const image = await Image.findById(data.imageId);
          if (image) {
            const redis = getRedisClient();
            const cacheKey = `images:${image.userId}:/api/images`;
            await redis.del(cacheKey);
          }

          console.log(`Image ${data.imageId} processed successfully`);
          channel.ack(msg);
        } catch (err) {
          console.error('Error processing message:', err.message);
          channel.nack(msg, false, true); // Requeue the message
        }
      }
    });
  } catch (err) {
    console.error('Worker failed to start:', err.message);
    process.exit(1);
  }
};

startWorker();
