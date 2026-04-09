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

const getLeaderboard = async (req, res, next) => {
    try {
        const metric = req.query.metric;
        let limit = Number(req.query.limit);
        let result;

        if (!limit) {
            limit = 10;
        }

        if (metric == 'count') {
            result = await Image.aggregate([
                {
                    $group: {
                        _id: "$userId",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: limit
                }
            ]);
        }

        else if (metric == 'size') {
            result = await Image.aggregate([
                {
                    $group: {
                        _id: "$userId",
                        size: { $sum: '$size' }
                    }
                },
                {
                    $sort: { size: -1 }
                },
                {
                    $limit: limit
                }
            ]);
        }

        else {
            return res.status(400).json({ error: "Wrong format of query" });
        }

        return res.status(200).json(result);
    }

    catch (err) {
        next(err);
    }
}

module.exports = { countImages, getLeaderboard };