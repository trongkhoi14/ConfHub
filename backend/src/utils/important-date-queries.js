const model = require('../models/index.js');
const { Op } = require('sequelize');
const { isEmpty } = require('../utils/input-handler.js');
const moment = require('moment');
const SettingQuery = require('./setting-queries.js');
require('dotenv').config();

const selectConferenceDates = async function (cfpID, option) {
    try {
        if (option === "new") {
            return await model.importantDateModel.findAll({
                where: {
                    CallForPaperCfpId: cfpID,
                    status: "new"
                }
            });
        }
        return await model.importantDateModel.findAll(
            { where: { CallForPaperCfpId: cfpID } }
        );

    } catch (error) {
        throw (error);
    }
};

const selectDate = async function (dateID) {
    try {
        return await model.importantDateModel.findByPk(dateID);
    } catch (error) {
        throw (error);
    }
};

const insertDates = async function (conference, transaction) {
    try {
        const datesArr = conference.importantDates.map(element => {
            return {
                date_type: element.date_type,
                date_value: element.date_value,
                CallForPaperCfpId: conference.cfp_id
            }
        });
        return await model.importantDateModel.bulkCreate(datesArr, { transaction: transaction });

    } catch (error) {
        throw (error);
    }
};

const updateDates = async function (conference, transaction) {
    try {
        const currentDates = await model.importantDateModel.findAll({
            where: {
                status: "new",
                CallForPaperCfpId: conference.cfp_id
            }
        });
        const currentDateTypes = currentDates.map(date => { return date.date_type });
        const newDateTypes = conference.importantDates.map(date => { return date.date_type });
        const toDeleteDates = currentDateTypes.filter(type => !newDateTypes.includes(type));

        for (const element of toDeleteDates) {
            const isExisted = await model.importantDateModel.findOne({
                where: {
                    date_type: element,
                    CallForPaperCfpId: conference.cfp_id
                }
            });
            if (isExisted) deleteDateByID(isExisted.date_id);
        }

        for (const element of conference.importantDates) {
            const isExisted = await model.importantDateModel.findOne({
                where: {
                    date_type: element.date_type,
                    CallForPaperCfpId: conference.cfp_id
                }
            });

            if (!isExisted) {
                const newDate = await model.importantDateModel.create({
                    date_type: element.date_type,
                    date_value: element.date_value,
                    CallForPaperCfpId: conference.cfp_id
                }, { transaction: transaction });

                const follows = await model.followModel.findAll({ where: { CallForPaperCfpId: conference.cfp_id } });
                if (follows) {
                    for (const follow of follows) {
                        let autoAddNoteSetting = {
                            userID: follow.UserId,
                            name: process.env.AUTO_ADD_EVENT_TO_SCHEDULE
                        }
                        const isEnable = await SettingQuery.isEnable(autoAddNoteSetting);
                        if (isEnable) {
                            await model.calenderNoteModel.create({
                                UserId: follow.UserId,
                                date_value: newDate.date_value,
                                ImportantDateDateId: newDate.date_id,
                                FollowTid: follow.tid
                            }, { transaction: transaction });
                        }
                    }
                }

            } else if (isExisted) {
                const newDate = await model.importantDateModel.create({
                    date_type: element.date_type,
                    date_value: element.date_value,
                    CallForPaperCfpId: conference.cfp_id
                }, { transaction: transaction });

                await isExisted.update(
                    { status: newDate.date_id },
                    { where: { date_id: isExisted.date_id } },
                    { transaction: transaction }
                );

                await model.importantDateModel.destroy({ where: { status: isExisted.date_id } }, { transaction: transaction });
                const oldNotes = await model.calenderNoteModel.findAll({ where: { ImportantDateDateId: isExisted.date_id } });
                for (const oldNote of oldNotes) {
                    await oldNote.update({
                        date_value: newDate.date_value,
                        ImportantDateDateId: newDate.date_id
                    }, { transaction: transaction });
                }
            }
        }
        return true;

    } catch (error) {
        throw (error);
    }
};

const deleteDateByID = async function (dateID, transaction) {
    try {
        const date = await model.importantDateModel.findByPk(dateID);
        if (date && date.status === "new") {
            await model.importantDateModel.destroy({ where: { status: date.date_id } }, { transaction: transaction });
            return await model.importantDateModel.destroy({ where: { date_id: date.date_id } }, { transaction: transaction });
        } else {
            return await model.importantDateModel.destroy({ where: { date_id: date.date_id } }, { transaction: transaction });
        }

    } catch (error) {
        throw (error);
    }
};

module.exports = {
    selectConferenceDates,
    selectDate,
    insertDates,
    updateDates,
    deleteDateByID
};