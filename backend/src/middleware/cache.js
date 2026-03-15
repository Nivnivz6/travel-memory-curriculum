const { getRedisClient } = require('../config/redis');

const cache = (keyPrefix) => {
  return async (req, res, next) => {
    try {
      const client = getRedisClient();
      const userKey = req.user ? `:${req.user._id}` : '';
      const key = `${keyPrefix}${userKey}:${req.originalUrl}`;
      const cached = await client.get(key);

      if (cached) {
        return res.json(JSON.parse(cached));
      }

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response before sending
      res.json = (data) => {
        client.setex(key, 3600, JSON.stringify(data)).catch(console.error);
        return originalJson(data);
      };

      next();
    } catch (err) {
      // If Redis fails, just skip caching
      console.error('Cache middleware error:', err.message);
      next();
    }
  };
};

module.exports = cache;
