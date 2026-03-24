const express = require('express');
const router = express.Router();
const {
  uploadImage,
  getImages,
  getImageById,
} = require('../controllers/imageController');
const upload = require('../middleware/upload');
const cache = require('../middleware/cache');
const { protect } = require('../middleware/auth');

router.post('/upload', protect, upload.single('image'), uploadImage);

router.get('/', protect, getImages);

router.get('/:id', protect, getImageById);

module.exports = router;
