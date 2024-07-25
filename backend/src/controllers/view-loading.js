const { conferenceData, loadDataForFilter } = require('../temp/index');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');

class ViewLoadingController {
    reloading = asyncHandler(async (req, res, next) => {
        try {
            loadDataForFilter();
            console.log("Reloading! Please wait...");
            return res.status(status.OK).json({
                message: "Reloading! Please wait...",
            });
        } catch (err) {
            next(err);
        }
    });
};

module.exports = ViewLoadingController;