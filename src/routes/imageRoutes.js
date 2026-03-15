const express = require('express');
const router = express.Router();
const {
  uploadImage,
  getImages,
  getImageById,
} = require('../controllers/imageController');
const upload = require('../middleware/upload');
const cache = require('../middleware/cache');

router.post('/upload', upload.single('image'), uploadImage);
router.get('/', cache('images'), getImages);
router.get('/:id', getImageById);

module.exports = router;
