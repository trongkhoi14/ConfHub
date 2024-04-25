const query = require("../utils/queries.js");
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');

class conferenceController {
    getAllAcronyms = asyncHandler(async (req, res, next) => {
        try {
            const acronyms = await query.ConferenceQuery.selectAllAcronyms();
            const acronymArr = acronyms.map(item => item.acronym);
            return res.status(status.OK).json({
                message: "Get all acronyms successfully",
                data: acronymArr
            });
        } catch (err) {
            next(err);
        }
    });
};

module.exports = conferenceController;