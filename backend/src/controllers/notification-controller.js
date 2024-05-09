const emailService = require('../services/mail-services.js');
const model = require('../models');
const query = require('../utils/queries.js');
const { status } = require('../constants/index.js');
const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

class NotificationController {
    // sendNotification = asyncHandler(async () => {
    //     try {
    //         const currentDate = new Date();
    //         const oneWeekLater = new Date(currentDate.getDate() + 7);

    //         const upcommingCfps = await model.callForPaperModel.findAll({
    //             where: [
    //                 { status: true },
    //                 {
    //                     [Op.or]: [
    //                         {
    //                             "$ImportantDates.status$": "new",
    //                             "$ImportantDates.date_value$": { [Op.between]: [currentDate, oneWeekLater] }
    //                         },
    //                         {
    //                             "$Organizations.status$": "new",
    //                             "$Organizations.start_date$": { [Op.between]: [currentDate, oneWeekLater] }
    //                         }
    //                     ]
    //                 }
    //             ],
    //             include: [
    //                 { model: model.conferenceModel, as: "Conference", required: false, duplicating: false },
    //                 { model: model.importantDateModel, as: "ImportantDates", required: false, duplicating: false, attributes: [] },
    //                 { model: model.organizationModel, as: "Organizations", required: false, duplicating: false, attributes: [] }
    //             ],
    //         });

    //         let upcomingEvents = [];

    //         for (const cfp of upcommingCfps) {
    //             const followers = await model.followModel.findAll({
    //                 where: { CallForPaperCfpId: cfp.cfp_id }
    //             });

    //             const upcomingDates = await model.importantDateModel.findAll({
    //                 where: {
    //                     status: "new",
    //                     CallForPaperCfpId: cfp.cfp_id
    //                 }
    //             }).then((date) => {
    //                 upcomingEvents.push({
    //                     title: process.env.TITLE_UPCOMING,
    //                     confName: cfp.conf_name,
    //                     date: date.date_type + ': ' + date.date_value.toString()
    //                 })
    //             });

    //             const upcomingOrgs = await model.organizationModel.findAll({
    //                 where: {
    //                     status: "new",
    //                     CallForPaperCfpId: cfp.cfp_id
    //                 }
    //             });

    //             conf.ConferenceDate.forEach(confDate => {
    //                 if (confDate.date >= currentDate && confDate.date < oneWeekLater) {
    //                     upcomingEvents.push({
    //                         title: conf.Title,
    //                         date: confDate.date,
    //                         keyword: confDate.keyword,
    //                         follow: confFollowers
    //                     });
    //                 }
    //             });

    //             conf.SubmissonDate.forEach(submissionDate => {
    //                 if (submissionDate.date >= currentDate && submissionDate.date < oneWeekLater) {
    //                     upcomingEvents.push({
    //                         title: conf.Title,
    //                         date: submissionDate.date,
    //                         keyword: submissionDate.keyword,
    //                         follow: confFollowers
    //                     });
    //                 }
    //             });

    //             conf.NotificationDate.forEach(notificationDate => {
    //                 if (notificationDate.date >= currentDate && notificationDate.date < oneWeekLater) {
    //                     upcomingEvents.push({
    //                         title: conf.Title,
    //                         date: notificationDate.date,
    //                         keyword: notificationDate.keyword,
    //                         follow: confFollowers
    //                     });
    //                 }
    //             });
    //         };

    //         for (const e of upcomingEvents) {
    //             for (const u of e.follow) {
    //                 const user = await dbUser.findById(u.userId)
    //                 const payload = {
    //                     confTitle: e.title,
    //                     eventName: e.keyword,
    //                     eventDate: e.date,
    //                     uEmail: user.email
    //                 }
    //                 await emailService.sendingEmail(payload)
    //             }
    //         }

    //     } catch (error) {
    //         console.log("Error in Notification Controller: " + error);
    //     }
    // })

    test = asyncHandler(async (req, res, next) => {
        try {
            const data = await query.NotificationQuery.insertNotification()
            return res.status(200).json({
                message: "Get all successfully",
                data: data
            });
        } catch (err) {
            next(err);
        }
    });

    getAllNotifications = asyncHandler(async (req, res, next) => {
        try {
            const userID = req.user._id;
            const notifications = await query.NotificationQuery.selectAllNotifications(userID);
            return res.status(status.OK).json({
                message: "Get all notifications successfully",
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
};

module.exports = NotificationController;