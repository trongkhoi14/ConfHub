const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
const { users } = require('../config/socket.js');
const { getETLLog, getUserLog } = require('../utils/dashboard.js');
const moment = require('moment');
const { Op } = require('sequelize');

class DashboardController {
    getLoginUsers = asyncHandler(async (req, res, next) => {
        try {
            // const userIDs = Array.from(users.keys());

            return res.status(status.OK).json({
                // count: userIDs.size,
                // userIDs: userIDs
                userIDs: [...users]
            });
        } catch (err) {
            next(err);
        }
    });

    getUserLog = asyncHandler(async (req, res, next) => {
        try {
            let conditions = [];
            const { begin, end } = req.query;

            if (begin && end) {
                conditions.push({ time: { [Op.between]: [moment.utc(begin).toDate(), moment.utc(end).toDate()] } });
            } else if (begin) {
                conditions.push({ time: { [Op.gte]: moment.utc(begin).toDate() } });
            } else if (end) {
                conditions.push({ time: { [Op.lte]: moment.utc(end).toDate() } });
            }

            const logs = await getUserLog(conditions);

            return res.status(status.OK).json({
                logs
            });
        } catch (err) {
            next(err);
        }
    });

    getETLLog = asyncHandler(async (req, res, next) => {
        try {
            let conditions = [];
            const { begin, end } = req.query;

            if (begin && end) {
                conditions.push({ time: { [Op.between]: [moment.utc(begin).toDate(), moment.utc(end).toDate()] } });
            } else if (begin) {
                conditions.push({ time: { [Op.gte]: moment.utc(begin).toDate() } });
            } else if (end) {
                conditions.push({ time: { [Op.lte]: moment.utc(end).toDate() } });
            }

            const logs = await getETLLog(conditions);

            return res.status(status.OK).json({
                logs
            });
        } catch (err) {
            next(err);
        }
    });
};

module.exports = DashboardController;