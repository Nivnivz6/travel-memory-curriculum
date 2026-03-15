const Redis = require('ioredis');

let client = null;

const getRedisClient = () => {
  if (!client) {
    client = new Redis(process.env.REDIS_URL);
  }
  return client;
};

const closeRedis = async () => {
  if (client) {
    await client.quit();
    client = null;
  }
};

module.exports = { getRedisClient, closeRedis };
