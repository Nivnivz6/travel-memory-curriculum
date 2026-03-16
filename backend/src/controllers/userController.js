const User = require('../models/User');

// @desc    Create a new user
// @route   POST /api/users
const createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      const error = new Error('Please provide username, email, and password');
      error.statusCode = 400;
      throw error;
    }

    // Manual duplicate check (no unique index on schema)
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const error = new Error('Username or email already exists');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({ username, email, password });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    res.json(user);
  } catch (err) {
    // Handle invalid ObjectId
    if (err.kind === 'ObjectId') {
      err.statusCode = 404;
      err.message = 'User not found';
    }
    next(err);
  }
};

module.exports = { createUser, getUserById };
