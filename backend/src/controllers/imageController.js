const Image = require('../models/Image');
const { uploadFile } = require('../services/s3Service');
const { publishMessage } = require('../services/queueService');

// @desc    Upload an image
// @route   POST /api/images/upload
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('Please upload an image file');
      error.statusCode = 400;
      throw error;
    }

    const { userId } = req.body;

    if (!userId) {
      const error = new Error('Please provide a userId');
      error.statusCode = 400;
      throw error;
    }

    // Upload file to S3
    const s3Result = await uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Save image metadata to MongoDB
    const image = await Image.create({
      userId,
      filename: req.file.originalname,
      s3Key: s3Result.key,
      s3Url: s3Result.url,
      status: 'pending',
    });

    // Publish message to RabbitMQ for background processing
    await publishMessage({
      imageId: image._id.toString(),
      s3Key: s3Result.key,
      action: 'process-image',
    });

    res.status(201).json(image);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all images
// @route   GET /api/images
const getImages = async (req, res, next) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    next(err);
  }
};

// @desc    Get image by ID
// @route   GET /api/images/:id
const getImageById = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      const error = new Error('Image not found');
      error.statusCode = 404;
      throw error;
    }

    res.json(image);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      err.statusCode = 404;
      err.message = 'Image not found';
    }
    next(err);
  }
};

module.exports = { uploadImage, getImages, getImageById };
