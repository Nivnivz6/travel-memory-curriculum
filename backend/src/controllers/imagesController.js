const Image = require('../models/Image')
const minioClient = require('../config/minio');
const dotenv = require('dotenv');

dotenv.config();

const uploadImage = async (req, res, next) => {
    try {
        const name = req.file.originalname
        const size = req.file.size
        const bucket = process.env.MINIO_BUCKET

        const image = await Image.create({
            userId: req.user.id,
            name: name,
            status: 'pending',
            s3Key: `${bucket}/${name}`, 
            size: size
        });

        await minioClient.putObject(bucket, name, req.file.buffer, size);

        return res.status(201).json(image);
    }

    catch (err) {
        next(err);
    }
}

module.exports = { uploadImage };