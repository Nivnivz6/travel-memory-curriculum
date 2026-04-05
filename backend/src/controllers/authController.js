import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { signToken } from "../utils/jwt.js";

const register = async (req, res) => {

  const email = req.body.email;
  const name = req.body.username;

  const password = req.body.password;

  try {

    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);
    console.log("create user");
    user = new User({ name, email, password: hashPassword });
    console.log(user);
    await user.save();
    const token = signToken({ userId: user._id });
    console.log(token);
    return res
      .status(201)
      .json({ msg: "Registered successfully", user, token });
  } catch (err) {

    console.log(err);
    return res.status(400).json({ msg: err });
  }
};

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
            console.log("try to find ");

    let user = await User.findOne({ email });
            console.log(user);
    

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(400).json({ msg: "Invalid credentials" });
    const token = signToken({ userId: user._id });
    return res.status(201).json({ msg: "Login successfully",user, token });
  } catch (err) { 
    return res.status(400).json({ msg: err });
  }
};

export { register, login };
