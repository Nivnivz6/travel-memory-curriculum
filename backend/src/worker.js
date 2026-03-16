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
        // TODO: Step 1 - Parse the message content back into a JavaScript object
        // const data = ...

        try {
          // TODO: Step 2 - "Process" the image.
          // In a real app, this is where you would resize images or detect objects using AI.
          // For now, just console.log the imageId being processed.

          // TODO: Step 3 - Update the image status in MongoDB to 'processed'
          // HINT: Use Image.findByIdAndUpdate()

          // TODO: Step 4 - Invalidate the Redis cache for the image owner.
          // Why? So the user sees their 'processed' status immediately on the next refresh!

          // TODO: Step 5 - Acknowledge the message (ack) to tell RabbitMQ it's done!
          // channel.ack(msg);
        } catch (err) {
          console.error('Error processing message:', err.message);
          // TODO: Step 6 - If something goes wrong, "Reject" or "Nack" the message
          // so it goes back into the queue for another try.
          // channel.nack(msg, false, true);
        }
      }
    });
  } catch (err) {
    console.error('Worker failed to start:', err.message);
    process.exit(1);
  }
};

startWorker();
