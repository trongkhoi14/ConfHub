const { status } = require('../constants/index.js');
const { sourceModel } = require('../models/index.js');
const asyncHandler = require('express-async-handler');

class SourceController {
    getAll = asyncHandler(async (req, res, next) => {
        const sources = await sourceModel.findAll({ attributes: ['src_name'] });
        const data = sources.map(item => item.src_name);
        try {
            res.status(status.OK).json({
                message: "Get all sources successfully",
                data: data
            })
        } catch (err) {
            next(err);
        }
    });
}

module.exports = SourceController;