const model = require('../models/index.js');
const { isEmpty } = require('../utils/input-handler.js');
const moment = require('moment');
const SettingQuery = require('./setting-queries.js');
require('dotenv').config();

const selectConferenceOrganizations = async function (cfpID, option) {
    try {
        if (option === "new") {
            return await model.organizationModel.findAll({
                where: {
                    CallForPaperCfpId: cfpID,
                    status: "new"
                }
            });
        }
        return await model.organizationModel.findAll(
            { where: { CallForPaperCfpId: cfpID } }
        );

    } catch (error) {
        throw (error);
    }
};

const selectOrganization = async function (orgID) {
    try {
        return await model.organizationModel.findByPk(orgID);
    } catch (error) {
        throw (error);
    }
};

const insertOrganizations = async function (conference, transaction) {
    try {
        const organiztionsArr = conference.organizations.map(element => {
            return {
                type: element.type,
                location: element.location,
                start_date: element.start_date,
                end_date: element.end_date,
                CallForPaperCfpId: conference.cfp_id
            }
        });
        return await model.organizationModel.bulkCreate(organiztionsArr, { transaction: transaction });

    } catch (error) {
        throw (error);
    }
};

const updateOrganizations = async function (conference, transaction) {
    try {
        for (const element of conference.organizations) {
            if (!isEmpty(element.org_id)) {
                const isExisted = await model.organizationModel.findByPk(element.org_id);

                if (isExisted && isExisted.status === "new") {
                    if (isEmpty(element.start_date) || isEmpty(element.end_date)) {
                        await deleteOrganizationByID(isExisted.org_id, transaction);

                    } else if (isExisted.type !== element.type
                        || isExisted.location !== element.location
                        || !(moment(isExisted.start_date)).isSame(moment(element.start_date))
                        || !(moment(isExisted.end_date)).isSame(moment(element.end_date))) {
                        const newOrganization = await model.organizationModel.create({
                            type: element.type,
                            location: element.location,
                            start_date: element.start_date,
                            end_date: element.end_date,
                            CallForPaperCfpId: conference.cfp_id
                        }, { transaction: transaction });

                        await isExisted.update(
                            { status: newOrganization.org_id },
                            { where: { org_id: isExisted.org_id } },
                            { transaction: transaction }
                        );

                        await model.organizationModel.destroy({ where: { status: isExisted.org_id } }, { transaction: transaction });
                        const oldNotes = await model.calenderNoteModel.findAll({ where: { OrganizationOrgId: isExisted.org_id } });
                        await Promise.all(oldNotes.map(async (oldNote) => {
                            await oldNote.update({
                                date_value: [newOrganization.start_date, newOrganization.end_date].join(" to "),
                                OrganizationOrgId: newOrganization.org_id
                            }, { transaction: transaction });
                        }));
                    }
                }
            } else if (!isEmpty(element.start_date) && !isEmpty(element.end_date)) {
                const newOrganization = await model.organizationModel.create({
                    type: element.type,
                    location: element.location,
                    start_date: element.start_date,
                    end_date: element.end_date,
                    CallForPaperCfpId: conference.cfp_id
                }, { transaction: transaction });

                const follows = await model.followModel.findAll({ where: { CallForPaperCfpId: conference.cfp_id } });
                if (follows) {
                    let autoAddNoteSetting = {
                        userID: follow.UserId,
                        name: process.env.AUTO_ADD_EVENT_TO_SCHEDULE
                    }
                    const isEnable = await SettingQuery.isEnable(autoAddNoteSetting);
                    if (isEnable) {
                        await Promise.all(follows.map(async (follow) => {
                            await model.calenderNoteModel.create({
                                UserId: follow.UserId,
                                date_value: [newOrganization.start_date, newOrganization.end_date].join(" to "),
                                OrganizationOrgId: newOrganization.org_id,
                                FollowTid: follow.tid
                            }, { transaction: transaction });
                        }));
                    }
                }

            };
        }

        return true;

    } catch (error) {
        throw (error);
    }
};

const deleteOrganizationByID = async function (orgID, transaction) {
    try {
        const organization = await model.organizationModel.findByPk(orgID);
        if (organization && organization.status === "new") {
            await model.organizationModel.destroy({ where: { status: organization.org_id } }, { transaction: transaction });
            return await model.organizationModel.destroy({ where: { org_id: organization.org_id } }, { transaction: transaction });
        } else {
            return await model.organizationModel.destroy({ where: { org_id: organization.org_id } }, { transaction: transaction });
        }

    } catch (error) {
        throw (error);
    }
}

module.exports = {
    selectConferenceOrganizations,
    selectOrganization,
    insertOrganizations,
    updateOrganizations,
    deleteOrganizationByID
};