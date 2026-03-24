const User = require('../models/User');

// @desc    Create a new user
// @route   POST /api/users
const createUser = async (req, res, next) => {
  try {
    // Extract `username`, `email`, and `password` from `req.body`
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    // Validate all three fields exist
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide username, email, and password' });
    }

    // MANUAL DUPLICATE CHECK — Query the database
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create the user
    const user = await User.create({ username, email, password });

    // Respond
    return res.status(201).json(user);
  }

  catch (err) {
    next(err);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    // Use `req.params.id` to query
    const user = await User.findById(req.params.id);

    // If !user, create an error with message 'User not found' and statusCode 404, throw it
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond
    return res.json(user);
  }

  catch (err) {
    // Handle invalid ObjectId format
    if (err.kind === 'ObjectId') {
      err.statusCode = 404;
      err.message = 'User not found';
    }
    next(err);
  }
};

module.exports = { createUser, getUserById };
