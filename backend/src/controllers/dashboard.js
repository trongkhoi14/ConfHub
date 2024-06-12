const { conferenceData, loadDataForFilter } = require('../temp/index');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
const { users } = require('../config/socket.js');

class DashboardController {
    getLoggingUsers = asyncHandler(async (req, res, next) => {
        try {
            // const userIDs = Array.from(users.keys());
            const array = Array.from(users, ([userID, socketID]) => ({ userID, socketID }));

            return res.status(status.OK).json({
                count: array.size,
                userIDs: array
            });
        } catch (err) {
            next(err);
        }
    });
};

module.exports = DashboardController;