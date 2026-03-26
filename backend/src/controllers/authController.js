const jwt = require('jsonwebtoken');
const User = require('../models/User')

const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const registerUser = async (req, res, next) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        if (!username || !email || !password) {
            return res.status(401).json({ error: 'One of the fields is missing' })
        }

        const user = await User.create({ username, email, password });

        if (!user) {
            return res.status(401).json({ error: 'User already exists' });
        }

        const token = generateToken(user);
        return res.status(201).json({ _id: user._id, username: username, email: email, token: token });
    }

    catch (err) {
        next(err);
    }
}

const loginUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(401).json({ error: 'Email or password is missing' })
        }

        const user = await User.findOne({ email: email }).exec();

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Wrong email or password' });
        }

        const token = generateToken(user);
        return res.status(200).json({ _id: user._id, username: user.username, email: email, token: token });
    }

    catch (err) {
        next(err);
    }
}

module.exports = { registerUser, loginUser };