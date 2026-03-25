const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
import { signToken } from "../utils/jwt";

const router = express.Router();

const register = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashPassword });
    await user.save();
    const token = signToken({ userId: user._id });
    res.status(201).json({ msg: "Registered successfully", token });
  } catch (err) {
    return res.status(400).json({ msg: err });
  }
};

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(400).json({ msg: "Invalid credentials" });
    const token = signToken({ userId: user._id });
    res.status(201).json({ msg: "Login successfully", token });
  } catch (err) {
    return res.status(400).json({ msg: err });
  }
};

export { register, login };

