const s3 = require('../config/s3');

const uploadFile = async (fileBuffer, filename, mimetype) => {
  // TODO: 1. Construct a unique Key for the file (e.g., use Date.now() + original filename)
  
  // TODO: 2. Define the 'params' for the s3.upload() call:
  //          - Bucket: (from process.env.AWS_S3_BUCKET)
  //          - Key: (your unique key)
  //          - Body: (the fileBuffer)
  //          - ContentType: (the mimetype)
  
  // TODO: 3. Call s3.upload(params).promise() to perform the upload.
  
  // TODO: 4. Return an object containing the 'key' and the 'url' (Location) of the uploaded file.
  return {
    key: 'TODO_KEY',
    url: 'TODO_URL'
  };
};

module.exports = { uploadFile };
