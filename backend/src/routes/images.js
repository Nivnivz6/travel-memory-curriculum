const { uploadImage } = require('../controllers/imagesController');
const authMiddleware = require('../middleware/auth');
const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', authMiddleware, upload.single('image'), uploadImage);
// router.get('', );
// router.delete('', );

module.exports = router;