const model = require('../models/index.js');
const { isEmpty } = require('../utils/input-handler.js');
const moment = require('moment');
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
        for (const element of conference.importantDates) {
            if (!isEmpty(element.date_id)) {
                const isExisted = await model.importantDateModel.findByPk(element.date_id)

                if (isExisted && isExisted.status === "new") {
                    if (isEmpty(element.date_value)) {
                        await deleteDateByID(isExisted.date_id, transaction);

                    } else if (!(moment(isExisted.date_value)).isSame(moment(element.date_value))) {
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
                        await Promise.all(oldNotes.map(async (oldNote) => {
                            await oldNote.update({
                                date_value: newDate.date_value,
                                ImportantDateDateId: newDate.date_id
                            }, { transaction: transaction });
                        }));
                    }
                }

            } else if (!isEmpty(element.date_value)) {
                const newDate = await model.importantDateModel.create({
                    date_type: element.date_type,
                    date_value: element.date_value,
                    CallForPaperCfpId: conference.cfp_id
                }, { transaction: transaction });

                const follows = await model.followModel.findAll({ where: { CallForPaperCfpId: conference.cfp_id } });
                if (follows) {
                    await Promise.all(follows.map(async (follow) => {
                        await model.calenderNoteModel.create({
                            UserId: follow.UserId,
                            date_value: newDate.date_value,
                            ImportantDateDateId: newDate.date_id,
                            FollowTid: follow.tid
                        }, { transaction: transaction });
                    }));
                }

            };
        };

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