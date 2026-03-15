const { getChannel } = require('../config/rabbitmq');

const QUEUE_NAME = 'image-processing';

const publishMessage = async (message) => {
  const channel = getChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log(`Message sent to queue "${QUEUE_NAME}":`, message);
};

module.exports = { publishMessage, QUEUE_NAME };
