const Image = require('../models/Image');
const { uploadFile } = require('../services/s3Service');
const { publishMessage } = require('../services/queueService');

// @desc    Upload a new image
// @route   POST /api/images/upload
const uploadImage = async (req, res, next) => {
  try {
    // Check that a file was uploaded: if (!req.file) return error 400.
    if (!req.file) {
      return res.status(400).json({ error: 'file was not uploaded' });
    }

    // Check that req.user exists (the Auth middleware sets this).
    if (!req.user) {
      return res.status(400).json({ error: 'user doesnt exist' });
    }

    // Upload the file buffer to S3/MinIO: const s3Result = await uploadFile(req.file);
    const s3Result = await uploadFile(req.file.buffer, req.file.filename, req.file.mimetype);

    // Create an Image document in MongoDB. VERY IMPORTANT:
    //          Set the `status` field to 'pending'. This ensures that the image
    //          PERSISTS in the database even before it is processed!
    //          { userId: req.user._id, filename: req.file.originalname, s3Key: s3Result.key, s3Url: s3Result.url, status: 'pending' }
    const image = await Image.create({ userId: req.user._id, filename: req.file.originalname, s3Key: s3Result.key, s3Url: s3Result.url, status: 'pending' })

    const message = {
      imageId: image._id,
      s3Key: s3Result.key,
      action: 'process-image'
    }

    publishMessage(message)

    // Respond with 201 and the saved image document.
    return res.status(201).json(image);
  }

  catch (err) {
    next(err);
  }
};

// @desc    Get all images (DATA ISOLATION!)
// @route   GET /api/images
const getImages = async (req, res, next) => {
  try {
    // CRITICAL — Data Isolation!
    // DO NOT use Image.find({}) — that returns EVERYONE's images!
    // You MUST filter by the logged-in user:
    //   const images = await Image.find({ userId: req.user._id });
    // Then respond with res.json(images);
    const images = await Image.find({ userId: req.user._id });
    return res.json(images);
  }

  catch (err) {
    next(err);
  }
};

// @desc    Get image by ID
// @route   GET /api/images/:id
const getImageById = async (req, res, next) => {
  try {
    // Query: const image = await Image.findById(req.params.id);
    const image = await Image.findById(req.params.id);

    // If !image, throw a 404 error with message 'Image not found'.
    if (!image) {
      return res.status(404).json({ error: 'image not found' });
    }

    // Respond with res.json(image);
    return res.json(image);
  }

  catch (err) {
    if (err.kind === 'ObjectId') {
      err.statusCode = 404;
      err.message = 'Image not found';
    }
    next(err);
  }
};

module.exports = { uploadImage, getImages, getImageById };
