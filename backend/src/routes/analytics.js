const { countImages, getLeaderboard } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/images', authMiddleware, countImages);
router.get('/uploads', authMiddleware, getLeaderboard);

module.exports = router;