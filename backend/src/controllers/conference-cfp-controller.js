const model = require('../models/index.js');
const query = require('../utils/queries.js');
const input = require('../utils/input-handler.js');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

class ConferenceCFPController {
    // [GET] /api/v1/conference/
    getAllConferences = asyncHandler(async (req, res, next) => {
        try {
            const filterConditions = await input.getFilterConditions(req);
            const conferences = await query.CallForPaperQuery.selectAllCallForPapers(filterConditions);
            return res.status(status.OK).json({
                maxRecords: conferences.maxRecords,
                maxPages: conferences.maxPages,
                size: conferences.size,
                currentPage: conferences.currentPage,
                count: conferences.count,
                data: conferences.data
            });

        } catch (err) {
            next(err);
        }
    });

    // [GET] /api/v1/conference?id
    getConferenceDetail = asyncHandler(async (req, res, next) => {
        try {
            const conferenceID = req.params?.id;
            const conferenceData = await query.CallForPaperQuery.selectCallForPaper(conferenceID);
            return res.status(status.OK).json({
                data: conferenceData
            });

        } catch (err) {
            next(err);
        }
    });
};

module.exports = ConferenceCFPController;