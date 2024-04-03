const { status } = require('../constants/index.js');
const { conferenceModel } = require('../models/index.js');
const asyncHandler = require('express-async-handler');

class conferenceController {
    getAllAcronyms = asyncHandler(async (req, res, next) => {
        const acronyms = await conferenceModel.findAll({ attributes: ['acronym'] });
        const data = acronyms.map(item => item.acronym);
        try {
            res.status(status.OK).json({
                message: "Get all acronyms successfully",
                data: data
            })
        } catch (err) {
            next(err);
        }
    });
}

module.exports = conferenceController;