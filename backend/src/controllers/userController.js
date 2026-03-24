const User = require("../models/User");

// @desc    Create a new user
// @route   POST /api/users
const createUser = async (req, res, next) => {
  try {
    // TODO: 1. Extract `username`, `email`, and `password` from `req.body`.
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    // TODO: 2. Validate all three fields exist. If missing, create an error with
    //          message 'Please provide username, email, and password',
    //          set error.statusCode = 400, and throw it.

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide username, email, and password" });
    }
    // TODO: 3. MANUAL DUPLICATE CHECK — Query the database:
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists" });
    }
    // TODO: 4. Create the user: const user = await User.create({ username, email, password });
    const user = await User.create({ username, email, password });
    // TODO: 5. Respond with:
    return res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    // TODO: 1. Use `req.params.id` to query: const user = await User.findById(req.params.id);
    const user = await User.findById(req.params.id)
    // TODO: 2. If !user, create an error with message 'User not found' and statusCode 404, throw it.
     if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // TODO: 3. Respond with: res.json(user);
    return res.json(user);
  } catch (err) {
    // Handle invalid ObjectId format
    if (err.kind === "ObjectId") {
      err.statusCode = 404;
      err.message = "User not found";
    }
    next(err);
  }
};

module.exports = { createUser, getUserById };
