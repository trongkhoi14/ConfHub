const query = require("../utils/queries.js");
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');

class ImportantDateController {
    getConferenceDates = asyncHandler(async (req, res, next) => {
        try {
            const cfpID = req.body.cfp_id;
            const dates = await query.ImportantDatesQuery.selectConferenceDates(cfpID);
            // permission
            return res.status(status.OK).json({
                message: "Get all dates of this conference successfully",
                data: dates
            });

        } catch (err) {
            next(err);
        }
    });

    deleteDateByID = asyncHandler(async (req, res, next) => {
        try {
            const dateID = req.params?.id;
            await query.ImportantDatesQuery.deleteDateByID(dateID);
            // permission
            return res.status(status.OK).json({
                message: "Delete successfully"
            });
        } catch (error) {
            next(err);
        }
    });
}

module.exports = ImportantDateController;