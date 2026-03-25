const { registerUser } = require('../controllers/authController');
const authMiddleware = require('./authMiddleware');
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/auth/login', authMiddleware, (req, res, err, next) => {
    registerUser(req, res, err, next)
});

app.post('api/auth/register', authMiddleware, (req, res, err, next) => {

});