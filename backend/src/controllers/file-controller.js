const { Conference } = require('../models/mongodb-conference');
const { status } = require('../constants/index.js');

class MongoDBConference {
    insert = asyncHandler(async (req, res, next) => {
        try {
            const existingConference = await Conference.findOne({ Title: title, Acronym: acronym });

            if (existingConference) {

            } else {

            }

            return res.status(status.OK).json({

            });

        } catch (err) {
            next(err);
        }
    });
}

module.exports = MongoDBConference;