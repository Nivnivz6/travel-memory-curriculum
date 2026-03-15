const amqplib = require('amqplib');

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  connection = await amqplib.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  console.log('RabbitMQ Connected');
  return channel;
};

const getChannel = () => channel;

const closeRabbitMQ = async () => {
  if (channel) await channel.close();
  if (connection) await connection.close();
  channel = null;
  connection = null;
};

module.exports = { connectRabbitMQ, getChannel, closeRabbitMQ };
