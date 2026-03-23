const User = require('../models/User');

// @desc    Create a new user
// @route   POST /api/users
const createUser = async (req, res, next) => {
  try {
    // Extract `username`, `email`, and `password` from `req.body`.
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    // Validate all three fields exist. If missing, create an error with
    //          message 'Please provide username, email, and password',
    //          set error.statusCode = 400, and throw it.
    if (!username || !email || !password) {
      return re.status(400).json({ error: 'Please provide username, email, and password' });
    }

    // MANUAL DUPLICATE CHECK — Query the database:
    //          const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    //          If existingUser, throw an error with message 'Username or email already exists'
    //          and statusCode 400.
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return re.status(400).json({ error: 'Username or email already exists' });
    }

    // Create the user: const user = await User.create({ username, email, password });
    const user = await User.create({ username, email, password });

    // Respond with: res.status(201).json(user);
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
    // Use `req.params.id` to query: const user = await User.findById(req.params.id);
    const user = await User.findById(req.params.id);

    // TODO: 2. If !user, create an error with message 'User not found' and statusCode 404, throw it.
    if (!user) {
      return re.status(404).json({ error: 'User not found' });
    }

    // Respond with: res.json(user);
    return res.status(201).json(user);
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
