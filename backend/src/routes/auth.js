const registerUser = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/auth/register', registerUser);

module.exports = router;