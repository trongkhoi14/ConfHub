const model = require('../models');
const query = require('../utils/queries.js');
const { status } = require('../constants/index.js');
const { sendNotifications, selectUpcomingEvents } = require('../services/notification-services.js');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

class NotificationController {
    static sendUpcomingNotification = asyncHandler(async (req, res, next) => {
        try {
            const events = await selectUpcomingEvents(30);
            await sendNotifications(events);
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
            if (!notification.read_status) {
                notification.read_status = true;
                await notification.save();
            }
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