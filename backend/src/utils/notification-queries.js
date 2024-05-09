const model = require('../models');
const { selectCallForPaper } = require('./cfp-queries')
const template = require('../templates');
const moment = require('moment');
const { Op } = require('sequelize');
require('dotenv').config();

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
                confName: conference.information.name,
                date: date.date_type + ': ' + date.date_value
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
                confName: conference.information.name,
                date: 'Is ongoing from ' + org.start_date + ' to ' + org.end_date
            })
        }
    };

    return { upcomingEvents };
};

const insertNotification = async function () {
    const { upcomingEvents } = await selectUpcomingEvents();
    for (const event of upcomingEvents) {
        const followers = await model.userModel.findAll({
            include: {
                model: model.followModel,
                where: {
                    CallForPaperCfpId: event.cfp_id
                }
            }
        });

        // chèn uEmail cho upcomingEvent
        // tạo notification
        // gửi mail hàm khác
    }
    return upcomingEvents;
}

const selectAllNotifications = async function (userID) {
    return await model.notificationModel.findAll({
        include: [{
            model: model.followModel,
            where: {
                UserId: userID
            }
        }]
    });
}

const selectNotification = async function (notiID) {
    return await model.notificationModel.findByPk(notiID);
}

module.exports = {
    insertNotification,
    selectAllNotifications,
    selectNotification
}