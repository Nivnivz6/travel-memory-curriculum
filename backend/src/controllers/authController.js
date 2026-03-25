const jwt = require('jsonwebtoken');
const Math = require('Math');

const rand = () => {
    return Math.random().toString(36).substring(2); // remove `0.`
};

const generateToken = () => {
    return rand() + rand(); // to make it longer
};

export const registerUser = (req, res, err, next) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        if (!username || !email || !password) {
            return res.status(401).json({ error: 'One of the fields is missing' })
        }

        const token = generateToken();
        res.status(201).json({  })
    }

    catch (err) {
        next(err)
    }
}