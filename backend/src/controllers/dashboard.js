const { conferenceData, loadDataForFilter } = require('../temp/index');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
const { users } = require('../config/socket.js');

class DashboardController {
    getLoggingUsers = asyncHandler(async (req, res, next) => {
        try {
            const userIDs = Array.from(users.keys());

            return res.status(status.OK).json({
                count: userIDs.length,
                userIDs: userIDs
            });
        } catch (err) {
            next(err);
        }
    });
};

module.exports = DashboardController;