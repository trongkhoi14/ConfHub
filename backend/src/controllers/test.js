
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
const { readFileFromDrive } = require('../services/drive-services.js');

class test {
    test = asyncHandler(async (req, res, next) => {
        try {
            const a = await readFileFromDrive();
            return res.status(status.OK).json({
                message: a,

            });
        } catch (err) {
            next(err);
        }
    });
}

module.exports = test;