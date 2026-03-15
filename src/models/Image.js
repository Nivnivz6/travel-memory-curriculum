const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    filename: {
      type: String,
      required: [true, 'Filename is required'],
    },
    s3Key: {
      type: String,
      required: [true, 'S3 key is required'],
    },
    s3Url: {
      type: String,
      required: [true, 'S3 URL is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'processed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Image', imageSchema);
