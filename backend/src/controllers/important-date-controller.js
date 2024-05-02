const query = require("../utils/queries.js");
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');

class ImportantDateController {
    getConferenceDates = asyncHandler(async (req, res, next) => {
        try {
            const cfpID = req.params?.id;
            const dates = await query.ImportantDatesQuery.selectConferenceDates(cfpID);
            return res.status(status.OK).json({
                message: "Get all dates of this conference successfully",
                data: dates
            });

        } catch (err) {
            next(err);
        }
    });

    getDate = asyncHandler(async (req, res, next) => {
        try {
            const dateID = req.params?.id;
            const date = await query.ImportantDatesQuery.selectDate(dateID);
            return res.status(status.OK).json({
                data: date
            });

        } catch (err) {
            next(err);
        }
    });
}

module.exports = ImportantDateController;