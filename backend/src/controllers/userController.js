const User = require('../models/User');

// @desc    Create a new user
// @route   POST /api/users
const createUser = async (req, res, next) => {
  try {
    // TODO: 1. Extract `username`, `email`, and `password` from `req.body`.
    // TODO: 2. Validate all three fields exist. If missing, create an error with
    //          message 'Please provide username, email, and password',
    //          set error.statusCode = 400, and throw it.
    // TODO: 3. MANUAL DUPLICATE CHECK — Query the database:
    //          const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    //          If existingUser, throw an error with message 'Username or email already exists'
    //          and statusCode 400.
    // TODO: 4. Create the user: const user = await User.create({ username, email, password });
    // TODO: 5. Respond with: res.status(201).json(user);
    return res.status(501).json({ error: 'Not implemented' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    // TODO: 1. Use `req.params.id` to query: const user = await User.findById(req.params.id);
    // TODO: 2. If !user, create an error with message 'User not found' and statusCode 404, throw it.
    // TODO: 3. Respond with: res.json(user);
    return res.status(501).json({ error: 'Not implemented' });
  } catch (err) {
    // Handle invalid ObjectId format
    if (err.kind === 'ObjectId') {
      err.statusCode = 404;
      err.message = 'User not found';
    }
    next(err);
  }
};

module.exports = { createUser, getUserById };
