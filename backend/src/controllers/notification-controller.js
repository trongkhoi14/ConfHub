const model = require('../models');
const query = require('../utils/queries.js');
const { status } = require('../constants/index.js');
const { sendUpcomingNotification } = require('../utils/notification-handler.js');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

class NotificationController {
    static sendUpcoming = asyncHandler(async (req, res, next) => {
        try {
            await sendUpcomingNotification();
        } catch (err) {
            throw (err);
        }
    });

    getAllNotifications = asyncHandler(async (req, res, next) => {
        try {
            const userID = req.user._id;
            const notifications = await query.NotificationQuery.selectAllNotifications(userID);
            return res.status(status.OK).json({
                message: "Get all notifications successfully.",
                data: notifications
            });
        } catch (err) {
            next(err);
        }
    });

    getNotification = asyncHandler(async (req, res, next) => {
        try {
            const notiID = req.params?.id;
            const notification = await query.NotificationQuery.selectNotification(notiID);
            return res.status(status.OK).json({
                data: notification
            });
        } catch (err) {
            next(err);
        }
    });

    deleteNotification = asyncHandler(async (req, res, next) => {
        try {
            const notiID = req.params?.id;
            const userID = req.user?._id;
            const isExisted = await model.notificationModel.findOne({
                where: {
                    tid: notiID
                },
                include: [{
                    model: model.followModel,
                    where: {
                        UserId: userID
                    }
                }]
            });

            if (!isExisted) {
                return res.status(status.OK).json({
                    message: "This notification is not existed."
                });
            }

            await query.NotificationQuery.deleteNotification(notiID);
            return res.status(status.OK).json({
                message: "Delete this notification successfully."
            });

        } catch (err) {
            next(err);
        }
    });
};

module.exports = NotificationController;