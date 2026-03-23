const Image = require("../models/Image");
const { uploadFile } = require("../services/s3Service");
const { publishMessage } = require("../services/queueService");

// @desc    Upload a new image
// @route   POST /api/images/upload
const uploadImage = async (req, res, next) => {
  try {
    // TODO: 1. Check that a file was uploaded: if (!req.file) return error 400
    if (!req.file) {
      return res.status(400).json({ error: "a file was not uploaded" });
    }
    // TODO: 2. Check that req.user exists (the Auth middleware sets this).
    if (!req.user) {
      return res.status(400).json({ error: "user is not exist" });
    }
    // TODO: 3. Upload the file buffer to S3/MinIO: const s3Result = await uploadFile(req.file);
    const s3Result = await uploadFile(req.file);
    // TODO: 4. Create an Image document in MongoDB. VERY IMPORTANT:
    //          Set the `status` field to 'pending'. This ensures that the image
    //          PERSISTS in the database even before it is processed!
    //          { userId: req.user._id, filename: req.file.originalname, s3Key: s3Result.Key, s3Url: s3Result.Location, status: 'pending' }
    const image = await Image.create({
      userId: req.user._id,
      filename: req.file.originalname,
      s3Key: s3Result.Key,
      s3Url: s3Result.Location,
      status: "pending",
    });

    // TODO: 5. Respond with 201 and the saved image document.

    return res.status(201).json(image);
    return res.status(501).json({ error: "Not implemented" });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all images (DATA ISOLATION!)
// @route   GET /api/images
const getImages = async (req, res, next) => {
  try {
    // TODO: CRITICAL — Data Isolation!
    // DO NOT use Image.find({}) — that returns EVERYONE's images!
    // You MUST filter by the logged-in user:
    //   const images = await Image.find({ userId: req.user._id });
    const images = await Image.find({ userId: req.user._id });
    // Then respond with res.json(images);
    return res.status(201).json(images);
    return res.status(501).json({ error: "Not implemented" });
  } catch (err) {
    next(err);
  }
};

// @desc    Get image by ID
// @route   GET /api/images/:id
const getImageById = async (req, res, next) => {
  try {
    // TODO: 1. Query: const image = await Image.findById(req.params.id);
    const image = await Image.findById(req.params.id);
    // TODO: 2. If !image, throw a 404 error with message 'Image not found'.
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }
    // TODO: 3. Respond with res.json(image);
    return res.status(201).json(image);

    return res.status(501).json({ error: "Not implemented" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      err.statusCode = 404;
      err.message = "Image not found";
    }
    next(err);
  }
};

module.exports = { uploadImage, getImages, getImageById };
