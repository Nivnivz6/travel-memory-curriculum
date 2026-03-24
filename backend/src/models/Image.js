const mongoose = require('mongoose');

// =============================================================
// Define the Image Schema
// =============================================================
// Create a new mongoose.Schema
// =============================================================
const imageSchema = new mongoose.Schema(
  {
    // Define userId field here
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
      // This links each image to the user who uploaded it (Data Isolation!).
    },

    // Define filename field here
    filename: {
      type: String,
      required: [true, 'Filename is required']
    },

    // Define s3Key field here
    s3Key: {
      type: String,
      required: [true, 'S3 key is required']
    },

    // Define s3Url field here
    s3Url: {
      type: String,
      required: [true, 'S3 URL is required']
    },

    // Define status field here
    status: {
      type: String,
      enum: ['pending', 'processed'],
      default: 'pending'
    }
  },
  // Automatically track createdAt/updatedAt.
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Image', imageSchema);
