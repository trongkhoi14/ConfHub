const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
const { users } = require('../config/socket.js');
const { getETLLog, getUserLog } = require('../utils/dashboard.js');

class DashboardController {
    getLoginUsers = asyncHandler(async (req, res, next) => {
        try {
            const userIDs = Array.from(users.keys());

            return res.status(status.OK).json({
                count: userIDs.size,
                userIDs: userIDs
            });
        } catch (err) {
            next(err);
        }
    });

    getUserLog = asyncHandler(async (req, res, next) => {
        try {
            const logs = await getUserLog();

            return res.status(status.OK).json({
                logs
            });
        } catch (err) {
            next(err);
        }
    });

    getETLLog = asyncHandler(async (req, res, next) => {
        try {
            const logs = await getETLLog()

            return res.status(status.OK).json({
                logs
            });
        } catch (err) {
            next(err);
        }
    });
};

module.exports = DashboardController;