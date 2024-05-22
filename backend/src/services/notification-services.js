const { getIO, users } = require('../config/socket');
const model = require('../models');
const { selectCallForPaper } = require('../utils/cfp-queries');
const { insertNotification } = require('../utils/notification-queries');
const template = require('../templates');
const emailService = require('../services/mail-services.js');
const moment = require('moment');
const { Op } = require('sequelize');
const { formatDate } = require('../utils/date-handler');
require('dotenv').config();

const sendNotificationToUser = (userID, message) => {
    const socketID = users.get(userID);
    if (socketID) {
        const io = getIO();
        io.to(socketID).emit('notification', message);
    } else {
        console.log(`User ${userID} is not connected`);
    }
};

const selectUpcomingEvents = async function () {
    const currentDate = new Date();
    const oneWeekLater = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    let upcomingEvents = [];

    const upcomingDates = await model.importantDateModel.findAll({
        where: {
            status: "new",
            date_value: { [Op.between]: [moment.utc(currentDate).toDate(), moment.utc(oneWeekLater).toDate()] },
        }
    })

    for (const date of upcomingDates) {
        if (date) {
            const conference = await selectCallForPaper(date.CallForPaperCfpId);
            upcomingEvents.push({
                title: process.env.TITLE_UPCOMING_EVENT,
                cfp_id: date.CallForPaperCfpId,
                confName: conference.information.name + ' - ' + conference.information.acronym,
                detail: '[UPCOMING] ' + date.date_type + ': "' + formatDate(date.date_value) + '"'
            });
        }
    };

    const upcomingOrgs = await model.organizationModel.findAll({
        where: {
            status: "new",
            start_date: { [Op.between]: [moment.utc(currentDate).toDate(), moment.utc(oneWeekLater).toDate()] },
        }
    })

    for (const org of upcomingOrgs) {
        if (org) {
            const conference = await selectCallForPaper(org.CallForPaperCfpId);
            upcomingEvents.push({
                title: process.env.TITLE_UPCOMING_EVENT,
                cfp_id: org.CallForPaperCfpId,
                confName: conference.information.name + ' - ' + conference.information.acronym,
                detail: org.end_date ? '[UPCOMING] Conference start from "' + formatDate(org.start_date) + ' to ' + formatDate(org.end_date) + '"'
                    : '[UPCOMING] Conference start from "' + formatDate(org.start_date) + '"'
            });
        }
    };
    return upcomingEvents;
};

const sendNotifications = async function (events) {
    for (const event of events) {
        const follows = await model.followModel.findAll({
            where: {
                CallForPaperCfpId: event.cfp_id,
            },
            include: [{ model: model.userModel }],
        });

        const message = template.notification.createNotification(event).message;

        for (const follow of follows) {
            const notification = {
                title: event.title,
                message: message,
                FollowTid: follow.tid
            }

            // send notification
            const [instance, created] = await insertNotification(notification);
            if (created) {
                sendNotificationToUser(follow.UserId, notification);
            }

            // send mail
            // if (!instance.stime) {
            //     const mail = {
            //         title: event.title,
            //         confName: event.confName,
            //         detail: event.detail,
            //         uEmail: follow.User.email
            //     }
            //     await emailService.sendingEmail(mail);
            //     instance.stime = new Date();
            //     instance.save();
            // }
        }
    }
    console.log("[" + new Date() + "] Finished sending emails.");
}

module.exports = {
    sendNotificationToUser,
    selectUpcomingEvents,
    sendNotifications
};