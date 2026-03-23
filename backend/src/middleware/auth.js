const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // TODO: 1. Check if the Authorization header exists AND starts with 'Bearer':
  //          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
  //
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret",
      );
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }
  // TODO: 2. Inside the if block, wrap everything in a try/catch:
  //          a. Extract the token: token = req.headers.authorization.split(' ')[1];
  //          b. Verify it: const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
  //          c. Find the user: req.user = await User.findById(decoded.id).select('-password');
  //          d. Call next() to allow the request to proceed.
  //
  // TODO: 3. In the catch block, return:
  //          res.status(401).json({ error: 'Not authorized, token failed' });
  //
  // TODO: 4. After the if block, check if token is still undefined:
  //          if (!token) { res.status(401).json({ error: 'Not authorized, no token' }); }
  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
  // Placeholder: reject all requests until you implement the above
  return res.status(401).json({ error: "Not authorized, no token" });
};

module.exports = { protect };
