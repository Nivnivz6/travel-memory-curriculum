const Image = require('../models/Image')
const minioClient = require('../config/minio');
const dotenv = require('dotenv');

dotenv.config();

const uploadImage = async (req, res, next) => {
    try {
        const filename = req.file.originalname
        const size = req.file.size
        const bucket = process.env.MINIO_BUCKET

        const image = await Image.create({
            userId: req.user.id,
            filename: filename,
            status: 'pending',
            s3Key: `${bucket}/${filename}`,
            size: size
        });

        await minioClient.putObject(bucket, filename, req.file.buffer, size);

        return res.status(201).json(image);
    }

    catch (err) {
        next(err);
    }
}

const getImages = async (req, res, next) => {
    try {
        const name = req.query.filename;
        const status = req.query.status;
        const minSize = req.query.minSize;
        const maxSize = req.query.maxSize;
        const fromDate = req.query.fromDate;
        const toDate = req.query.toDate;

        let filter = { userId: req.user.id };

        if (name) {
            filter['name'] = name;
        }

        if (status) {
            filter['status'] = status;
        }

        if (minSize || maxSize) {
            if (!maxSize) {
                filter['size'] = { $gte: Number(minSize) };
            }
            else if (!minSize) {
                filter['size'] = { $lte: Number(maxSize) };
            }
            else {
                filter['size'] = { $gte: Number(minSize), $lte: Number(maxSize) };
            }
        }

        if (fromDate || toDate) {
            if (!toDate) {
                filter['updatedAt'] = { $gt: fromDate };
            }
            else if (!fromDate) {
                filter['updatedAt'] = { $lt: toDate };
            }
            else {
                filter['updatedAt'] = { $gt: fromDate, $lt: toDate };
            }
        }

        const images = await Image.find(filter);
        return res.status(200).json(images);
    }

    catch (err) {
        next(err);
    }
}

const deleteImages = async (req, res, next) => {
    try {
        const ids = req.body.ids;
        let objectsNamesToDelete = [];
        let filter = {};

        if (ids.length === 0) {
            const stream = minioClient.listObjects(bucketName, '', true);
            stream.on('data', obj => {
                if (obj.name) {
                    objectsNamesToDelete.push(obj.name);
                }
            });
            stream.on('end', () => {minioClient.removeObjects(bucketName, objectNamesToDelete)});
            stream.on('error', (err) => {console.log(err)});
        }

        else {
            const objectsIdsToDelete = ids.map(id => new ObjectId(id));
            const images = await Image.find({ _id: { $in: objectsIdsToDelete } });
            objectsNamesToDelete = images.map(img => img.name);

            filter = {
                _id: { $in: objectsIdsToDelete }
            }
        }

        await Image.deleteMany(filter);
        await minioClient.removeObjects(process.env.MINIO_BUCKET, objectsNamesToDelete);

        return res.status(200).json({ message: "Images deleted successfully" });
    }

    catch (err) {
        next(err);
    }
}


module.exports = { uploadImage, getImages, deleteImages };