const Image = require('../models/Image')
const minioClient = require('../config/minio');
const dotenv = require('dotenv');

dotenv.config();

const uploadImage = async (req, res, next) => {
    try {
        const name = req.file.originalname
        const size = req.file.size

        const image = await Image.create({
            userId: req.user.id,
            name: name,
            status: 'pending',
            size: size
        });

        await minioClient.putObject(process.env.MINIO_BUCKET, name, req.file.buffer, size);

        return res.status(201).json(image);
    }

    catch (err) {
        next(err);
    }
}

module.exports = { uploadImage };