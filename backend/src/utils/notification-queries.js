const model = require('../models');
require('dotenv').config();

const selectAllNotifications = async function (userID) {
    return await model.notificationModel.findAll({
        include: [{
            model: model.followModel,
            where: {
                UserId: userID
            }
        }],
        order: [
            ['ctime', 'DESC']
        ]
    });
}

const selectNotification = async function (notiID) {
    return await model.notificationModel.findByPk(notiID);
}

const insertNotification = async function (notification, transaction) {
    return await model.notificationModel.findOrCreate({
        where: {
            title: notification.title,
            message: notification.message,
            FollowTid: notification.FollowTid,
        },
        defaults: {
            title: notification.title,
            message: notification.message,
            FollowTid: notification.FollowTid ? notification.FollowTid : null
        },
        transaction: transaction
    });
}

const deleteNotification = async function (notiID) {
    return await model.notificationModel.destroy({ where: { tid: notiID } });
}

module.exports = {
    insertNotification,
    selectAllNotifications,
    selectNotification,
    deleteNotification
}