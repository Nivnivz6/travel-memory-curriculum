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

const getImages = async (req, res, next) => {
    try {
        const name = req.query.name;
        const status = req.query.status;
        const minSize = req.query.minSize;
        const maxSize = req.query.maxSize;
        const fromDate = req.query.fromDate;
        const toDate = req.query.fromDate;

        const filter = {}

        if (name) {
            filter['name'] = name;
        }

        if (status) {
            filter['status'] = status;
        }

        if (minSize) {
            filter['size'] = { $bt: minSize };
        }

        if (maxSize) {
            filter['size'] = { $lt: maxSize };
        }

        if (fromDate) {
            filter['updatedAt'] = { $bt: fromDate };
        }

        if (toDate) {
            filter['updatedAt'] = { $lt: toDate };
        }

        return res.status(200).json(Image.find());
    }

    catch (err) {
        next(err);
    }
}

module.exports = { uploadImage, getImages };