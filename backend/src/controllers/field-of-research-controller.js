const query = require('../utils/queries');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
const { conferenceData } = require('../temp/index.js');

class fieldOfResearchController {
    getAllFieldOfResearch = asyncHandler(async (req, res, next) => {
        try {
            // const fors = await query.FieldOfResearchQuery.selectAllFieldsOfResearch();
            // const forArr = fors.map(item => item.for_name);

            const fors = conferenceData.listOfConferences.flatMap(item => {
                if (item.information.status == true && item.information.fieldOfResearch.length > 0) {
                    return item.information.fieldOfResearch;
                } else {
                    return [];
                }
            });

            const forArr = [...new Set(fors.filter(Boolean))];

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