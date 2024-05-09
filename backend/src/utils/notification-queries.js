const model = require('../models');
const { selectCallForPaper } = require('./cfp-queries')
const notiTemplate = require('../templates/notification-template');
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

    upcomingDates.forEach((date) => {
        if (date) {
            upcomingEvents.push({
                title: process.env.TITLE_UPCOMING_EVENT,
                cfp_id: date.CallForPaperCfpId,
                confName: selectCallForPaper(date.CallForPaperCfpId),
                date: date.date_type + ': ' + date.date_value
            });
        }
    });

    const upcomingOrgs = await model.organizationModel.findAll({
        where: {
            status: "new",
            start_date: { [Op.between]: [moment.utc(currentDate).toDate(), moment.utc(oneWeekLater).toDate()] },
        }
    })

    upcomingOrgs.forEach((org) => {
        if (org) {
            upcomingEvents.push({
                title: process.env.TITLE_UPCOMING_EVENT,
                cfp_id: org.CallForPaperCfpId,
                confName: selectCallForPaper(org.CallForPaperCfpId).information?.name,
                date: 'Is ongoing from ' + org.start_date + ' to ' + org.end_date
            })
        }
    });

    return { upcomingEvents };
};

const insertNotification = async function (notifications) {
    const { upcomingEvents } = await selectUpcomingEvents();
    // for (const event of upcomingEvents) {
    //     const followers = await model.userModel.findAll({
    //         include: {
    //             model: model.followModel,
    //             where: {
    //                 CallForPaperCfpId: event.cfp_id
    //             }
    //         }
    //     });
    // }
    console.log(upcomingEvents);
    return upcomingEvents;
}

module.exports = {
    insertNotification
}