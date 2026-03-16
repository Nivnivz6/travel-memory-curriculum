const { getRedisClient } = require('../config/redis');

const cache = (keyPrefix) => {
  return async (req, res, next) => {
    try {
      // TODO: 1. Get the Redis client using getRedisClient()
      
      // TODO: 2. Construct a unique cache key. 
      // HINT: Use the keyPrefix, the user's ID (if authenticated), and req.originalUrl
      
      // TODO: 3. Try to GET the data from Redis using the key.
      
      // TODO: 4. If data exists in cache:
      //          - Parse the stringified JSON back into an object.
      //          - Return the response immediately using res.json().
      
      // TODO: 5. If data DOES NOT exist in cache:
      //          - We need to capture the response from the next middleware/controller!
      //          - Override res.json to catch the data before it's sent to the client.
      //          - Inside the overridden res.json, use client.setex() to store the data in Redis.
      //          - HINT: Set an expiration time (e.g., 3600 seconds) so the cache doesn't stay forever.
      
      next();
    } catch (err) {
      console.error('Cache middleware error:', err.message);
      next();
    }
  };
};

module.exports = cache;
