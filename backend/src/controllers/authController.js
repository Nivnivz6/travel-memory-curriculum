const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    // TODO: 1. Extract `username`, `email`, and `password` from `req.body`.
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // TODO: 2. Validate that all three fields exist. If any are missing, return a 400 status:
    //          return res.status(400).json({ error: 'Please provide all fields' });

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Please provide all fields" });
    }
    // TODO: 3. MANUAL DUPLICATE CHECK — Since our schema has no `unique` index, YOU must
    //          query the database manually before creating the user:
    //          const userExists = await User.findOne({ $or: [{ email }, { username }] });
    //          If userExists, return 400 with { error: 'User already exists' }.

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }
    // TODO: 4. Create the new user: const user = await User.create({ username, email, password });
    const user = await User.create({ username, email, password });
    // TODO: 5. If user was created, respond with 201 and a JSON object containing:
    //          { _id: user._id, username: user.username, email: user.email, token: generateToken(user._id) }
    //          Otherwise, return 400 with { error: 'Invalid user data' }.
    if (user) {
      return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    // TODO: 1. Extract `email` and `password` from `req.body`.
    const email = req.body.email;
    const password = req.body.password;
    // TODO: 2. Validate both fields exist. Return 400 if missing.

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide all fields" });
    }
    // TODO: 3. Find the user by email. Since passwords are hidden by default (select: false),
    //          you MUST use: const user = await User.findOne({ email }).select('+password');
    const user = await User.findOne({ email }).select("+password");
    if (user && (await user.matchPassword(password))) {
      return res
        .status(200)
        .json({
          _id: user._id,
          username: user.username,
          email: user.email,
          token: generateToken(user._id),
        });
    }
    // TODO: 4. If user exists AND (await user.matchPassword(password)) is true,
    //          respond with: { _id, username, email, token: generateToken(user._id) }
    // TODO: 5. Otherwise, return 401 with { error: 'Invalid email or password' }.
    else {
      return res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (err) {
    next(err);
  }
};
