const { countImages } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/images', authMiddleware, countImages);

module.exports = router;