const { getChannel } = require('../config/rabbitmq');

const QUEUE_NAME = 'image-processing';

const publishMessage = async (message) => {
  const channel = getChannel();

  // TODO: Step 1 - Ensure the queue exists before sending (using assertQueue)
  // HINT: Use the QUEUE_NAME constant. Make sure the queue is 'durable'.

  // TODO: Step 2 - Send the message to the queue using sendToQueue
  // HINT: RabbitMQ expects a Buffer! You must JSON.stringify the message and then wrap it in Buffer.from()
  // HINT 2: Set the message as 'persistent' so it survives if RabbitMQ restarts.

  console.log(`TODO: Implement the logic above to send this message:`, message);
};

module.exports = { publishMessage, QUEUE_NAME };
