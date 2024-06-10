const { conferenceData, loadDataForFilter } = require('../temp/index');
const { status } = require('../constants/index.js');

class ViewLoadingController {
    reloading = asyncHandler(async (req, res, next) => {
        try {
            loadDataForFilter();

            return res.status(status.OK).json({
                message: "Reloading! Please wait...",
            });
        } catch (err) {
            next(err);
        }
    });
};

module.exports = ViewLoadingController;