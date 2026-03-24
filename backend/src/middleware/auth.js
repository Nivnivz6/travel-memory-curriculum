const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists AND starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token
      token = req.headers.authorization.split(' ')[1];

      // Verify it
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      // Find the user
      req.user = await User.findById(decoded.id).select('-password');

      // Call next() to allow the request to proceed
      next();
    }

    // In the catch block, return:
    //          res.status(401).json({ error: 'Not authorized, token failed' });
    catch {
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  // After the if block, check if token is still undefined
  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
};

module.exports = { protect };
