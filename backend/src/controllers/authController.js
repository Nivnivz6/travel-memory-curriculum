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
        return res.status(201).json({ _id: user._id, username: username, email: email, token: token })
    }

    catch (err) {
        next(err)
    }
}

module.exports = registerUser;