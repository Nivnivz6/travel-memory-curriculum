const Minio = require("minio");
const dotenv = require('dotenv');

dotenv.config();

const minioClient = new Minio.Client({
    port: process.env.MINIO_PORT,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    endPoint: process.env.MINIO_ENDPOINT,
    useSSL: 'true' === process.env.MINIO_USE_SSL
});

module.exports = minioClient;