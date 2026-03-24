const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    // Extract `username`, `email`, and `password` from `req.body`
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    // Validate that all three fields exist. If any are missing, return a 400 status
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide all fields' });
    }

    // MANUAL DUPLICATE CHECK — Since our schema has no `unique` index, YOU must
    //          query the database manually before creating the user
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create the new user
    const user = await User.create({ username, email, password });

    // If user was created, respond with 201 and a JSON object containing
    if (user) {
      return res.status(201).json({ _id: user._id, username: user.username, email: user.email, token: generateToken(user._id) });
    }

    return res.status(400).json({ error: 'Invalid user data' });
  }

  catch (err) {
    next(err);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    // Extract `email` and `password` from `req.body`
    const email = req.body.email
    const password = req.body.password

    // Validate both fields exist. Return 400 if missing
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide all fields' });
    }

    // Find the user by email. Since passwords are hidden by default (select: false),
    //          you MUST use: const user = await User.findOne({ email }).select('+password');
    const user = await User.findOne({ email }).select('+password');

    // If user exists AND (await user.matchPassword(password)) is true,
    //          respond with: { _id, username, email, token: generateToken(user._id) }
    if (user && await user.matchPassword(password)) {
      return res.status(201).json({ _id: user._id, username: user.username, email: user.email, token: generateToken(user._id) });
    }

    // Otherwise, return 401 with { error: 'Invalid email or password' }.
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  catch (err) {
    next(err);
  }
};
