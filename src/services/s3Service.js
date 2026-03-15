const s3 = require('../config/s3');

const uploadFile = async (fileBuffer, filename, mimetype) => {
  const key = `uploads/${Date.now()}-${filename}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: mimetype,
  };

  const result = await s3.upload(params).promise();

  return {
    key: result.Key,
    url: result.Location,
  };
};

module.exports = { uploadFile };
