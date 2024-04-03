const { status } = require('../constants/index.js');
const { fieldOfResearchModel } = require('../models/index.js');
const asyncHandler = require('express-async-handler');

class fieldOfResearchController {
    getAll = asyncHandler(async (req, res, next) => {
        const fors = await fieldOfResearchModel.findAll({ attributes: ['for_name'] });
        const data = fors.map(item => item.for_name);
        try {
            res.status(status.OK).json({
                message: "Get all field of researches successfully",
                data: data
            })
        } catch (err) {
            next(err);
        }
    });
}

module.exports = fieldOfResearchController;