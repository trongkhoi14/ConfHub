const query = require('../utils/queries');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');

class fieldOfResearchController {
    getAllFieldOfResearch = asyncHandler(async (req, res, next) => {
        try {
            const fors = await query.FieldOfResearchQuery.selectAllFieldsOfResearch();
            const forArr = fors.map(item => item.for_name);
            return res.status(status.OK).json({
                message: "Get all field of researches successfully",
                data: forArr
            });
        } catch (err) {
            next(err);
        }
    });
};

module.exports = fieldOfResearchController;