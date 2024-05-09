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
                name: element.name,
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
        const currentOrgs = await model.organizationModel.findAll({
            where: {
                status: "new",
                CallForPaperCfpId: conference.cfp_id
            }
        });
        const currentLocations = currentOrgs.map(org => { return org.name });
        const newLocations = conference.organizations.map(org => { return org.name });
        const toDeleteLocations = currentLocations.filter(name => !newLocations.includes(name));

        for (const element of toDeleteLocations) {
            const isExisted = await model.organizationModel.findOne({
                where: {
                    name: element,
                    CallForPaperCfpId: conference.cfp_id
                }
            });
            if (isExisted) deleteOrganizationByID(isExisted.org_id);
        }

        for (const element of conference.organizations) {
            const isExisted = await model.organizationModel.findOne({
                where: {
                    name: element.name,
                    CallForPaperCfpId: conference.cfp_id
                }
            });

            if (!isExisted) {
                const newOrganization = await model.organizationModel.create({
                    name: element.name,
                    type: element.type,
                    location: element.location,
                    start_date: element.start_date,
                    end_date: element.end_date,
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
                                date_value: [newOrganization.start_date, newOrganization.end_date].join(" to "),
                                OrganizationOrgId: newOrganization.org_id,
                                FollowTid: follow.tid
                            }, { transaction: transaction });
                        }
                    }
                }

            } else if (isExisted) {
                const newOrganization = await model.organizationModel.create({
                    name: element.name,
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
                for (const oldNote of oldNotes) {
                    await oldNote.update({
                        date_value: [newOrganization.start_date, newOrganization.end_date].join(" to "),
                        OrganizationOrgId: newOrganization.org_id
                    }, { transaction: transaction });
                }
            }
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