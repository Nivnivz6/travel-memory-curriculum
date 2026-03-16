const mongoose = require('mongoose');

// =============================================================
// TODO: Define the Image Schema
// =============================================================
// Create a new mongoose.Schema with the following fields:
//
// 1. userId:
//    - type: mongoose.Schema.Types.ObjectId
//    - ref: 'User'
//    - required: [true, 'User ID is required']
//    This links each image to the user who uploaded it (Data Isolation!).
//
// 2. filename:
//    - type: String
//    - required: [true, 'Filename is required']
//
// 3. s3Key:
//    - type: String
//    - required: [true, 'S3 key is required']
//
// 4. s3Url:
//    - type: String
//    - required: [true, 'S3 URL is required']
//
// 5. status:
//    - type: String
//    - enum: ['pending', 'processed']
//    - default: 'pending'
//
// Add { timestamps: true } as the second argument.
// =============================================================
const imageSchema = new mongoose.Schema(
  {
    // TODO: Define userId field here

    // TODO: Define filename field here

    // TODO: Define s3Key field here

    // TODO: Define s3Url field here

    // TODO: Define status field here
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Image', imageSchema);
