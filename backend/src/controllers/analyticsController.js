const Image = require('../models/Image');

const countImages = async (req, res, next) => {
    try {
        const userId = req.user._id
        const status = req.query.status;
        let filter = { userId: userId };

        if (status) {
            filter['status'] = status;
        }

        const count = await Image.countDocuments(filter);
        return res.status(200).json({ "count": count });
    }

    catch (err) {
        next(err);
    }
}

module.exports = { countImages };