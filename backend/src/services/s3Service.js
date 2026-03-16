const s3 = require('../config/s3');

const uploadFile = async (fileBuffer, filename, mimetype) => {
  // --- EXPLORE: S3 UPLOAD CHALLENGE ---
  
  // Step 1: GENERATE a unique Key for the object.
  // HINT: Use Date.now() combined with the original filename to prevent overwriting.
  // const key = ...;

  // Step 2: CONSTRUCT the 'params' object for the AWS S3 SDK.
  // Documentation: The SDK expects: Bucket, Key, Body, and ContentType.
  // const params = {
  //   Bucket: process.env.AWS_S3_BUCKET,
  //   ...
  // };

  // Step 3: EXECUTE the upload using s3.upload(params).
  // HINT: Append .promise() to the upload call to make it awaitable in this async function!
  // const result = await ...;

  // Step 4: RETURN the structured result.
  // The controller expects an object with 'key' and 'url' (found in result.Location).
  return {
    key: 'TODO: Return Key from result.Key',
    url: 'TODO: Return URL from result.Location'
  };
};

module.exports = { uploadFile };
