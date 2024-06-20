const { getIO, users } = require('../config/socket');
const model = require('../models');
const { selectCallForPaper } = require('../utils/cfp-queries');
const { insertNotification } = require('../utils/notification-queries');
const template = require('../templates');
const emailService = require('../services/mail-services.js');
const moment = require('moment');
const { Op } = require('sequelize');
const { formatDate } = require('../utils/date-handler');
const { conferenceData } = require('../temp/index.js');
const SettingQuery = require('../utils/setting-queries.js');
require('dotenv').config();

const sendNotificationToUser = (userID, message) => {
    const socketID = users.get(userID);
    if (socketID) {
        const io = getIO();
        io.to(socketID).emit('notification', message);

    } else {
        // console.log(`User ${userID} is not connected`);
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
            // const conference = await selectCallForPaper(date.CallForPaperCfpId);
            const conference = conferenceData.listOfConferences.filter(item => String(item.id) === String(date.CallForPaperCfpId));
            if (String(conference[0].information.status) === 'true') {
                upcomingEvents.push({
                    title: process.env.TITLE_UPCOMING_EVENT,
                    cfp_id: date.CallForPaperCfpId,
                    confName: conference[0].information.name + ' - ' + conference[0].information.acronym,
                    detail: '[UPCOMING] ' + date.date_type + ': "' + formatDate(date.date_value) + '"'
                });
            }
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
            // const conference = await selectCallForPaper(org.CallForPaperCfpId);
            const conference = conferenceData.listOfConferences.filter(item => String(item.id) === String(org.CallForPaperCfpId));
            if (String(conference[0].information.status) === 'true') {
                upcomingEvents.push({
                    title: process.env.TITLE_UPCOMING_EVENT,
                    cfp_id: org.CallForPaperCfpId,
                    confName: conference[0].information.name + ' - ' + conference[0].information.acronym,
                    detail: org.end_date ? '[UPCOMING] Conference start from "' + formatDate(org.start_date) + ' to ' + formatDate(org.end_date) + '"'
                        : '[UPCOMING] Conference start from "' + formatDate(org.start_date) + '"'
                });
            }
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

            // check setting receive email
            if (event.title === process.env.TITLE_UPCOMING_EVENT) {
                let receiveEmailSetting = {
                    userID: follow.UserId,
                    name: process.env.YOUR_UPCOMING_EVENT
                }
                const isEnable = await SettingQuery.isEnable(receiveEmailSetting);

                // send mail
                if (!instance.stime && isEnable == true) {

                    const mail = {
                        title: event.title,
                        confName: event.confName,
                        detail: event.detail,
                        uEmail: follow.User.email
                    }
                    await emailService.sendingEmail(mail);
                    instance.stime = new Date();
                    instance.save();
                }

            } else if (event.title == process.env.TITLE_NEW_UPDATED_EVENT || event.title == process.env.TITLE_CANCELLED_EVENT) {
                let receiveEmailSetting = {
                    userID: follow.UserId,
                    name: process.env.CHANGE_AND_UPDATE
                }
                const isEnable = await SettingQuery.isEnable(receiveEmailSetting);

                // send mail
                if (!instance.stime && isEnable == true) {

                    const mail = {
                        title: event.title,
                        confName: event.confName,
                        detail: event.detail,
                        uEmail: follow.User.email
                    }
                    await emailService.sendingEmail(mail);
                    instance.stime = new Date();
                    instance.save();
                }
            }
        }
    }
}

module.exports = {
    sendNotificationToUser,
    selectUpcomingEvents,
    sendNotifications
};