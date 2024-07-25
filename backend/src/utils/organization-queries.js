const model = require('../models/index.js');
const { isEmpty } = require('../utils/input-handler.js');
const moment = require('moment');
const SettingQuery = require('./setting-queries.js');
const { formatDate } = require('../utils/date-handler');
require('dotenv').config();

const selectConferenceOrganizations = async function (cfpID, option) {
    try {
        if (option === "new") {
            return await model.organizationModel.findAll({
                where: {
                    CallForPaperCfpId: cfpID,
                    status: "new"
                },
                // benchmark: true,
                // logging: console.log,
            });
        }
        return await model.organizationModel.findAll({
            where: { CallForPaperCfpId: cfpID },
            // benchmark: true,
            // logging: console.log,
        });

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
                name: !isEmpty(element.name) ? element.name : "location " + (conference.organizations.indexOf(element) + 1),
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
        let notifications = [];
        const conferenceDetail = await model.callForPaperModel.findOne({
            where: {
                cfp_id: conference.cfp_id
            },
            include: [{
                model: model.conferenceModel
            }]
        });

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
            if (isExisted) {
                await deleteOrganizationByID(isExisted.org_id, transaction);

                // [#hc]
                notifications.push({
                    title: process.env.TITLE_CANCELLED_EVENT,
                    cfp_id: conference.cfp_id,
                    confName: conferenceDetail.Conference.conf_name,
                    detail: isExisted.end_date ? '[DELETE] Conference start from ' + formatDate(isExisted.start_date) + ' to ' + formatDate(isExisted.end_date)
                        : '[DELETE] Conference start from ' + formatDate(isExisted.start_date)
                });
            }
        }

        for (const element of conference.organizations) {
            const isExisted = await model.organizationModel.findOne({
                where: {
                    name: element.name || "no location to find",
                    status: "new",
                    CallForPaperCfpId: conference.cfp_id
                }
            });

            if (!isExisted) {
                const newOrganization = await model.organizationModel.create({
                    name: !isEmpty(element.name) ? element.name : "location " + (conference.organizations.indexOf(element) + 1),
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
                // [#hc]
                notifications.push({
                    title: process.env.TITLE_NEW_UPDATED_EVENT,
                    cfp_id: conference.cfp_id,
                    confName: conferenceDetail.Conference.conf_name,
                    detail: newOrganization.end_date ? '[NEW] Conference start from "' + formatDate(newOrganization.start_date) + ' to ' + formatDate(newOrganization.end_date) + '"'
                        : '[NEW] Conference start from "' + formatDate(newOrganization.start_date) + '"'
                });

            } else if (isExisted) {
                if (isExisted.type !== element.type || isExisted.location !== element.location || !moment(isExisted.start_date).isSame(moment(formatDate(element.start_date))) || !moment(isExisted.end_date).isSame(formatDate(moment(element.end_date)))) {
                    const newOrganization = await model.organizationModel.create({
                        name: !isEmpty(element.name) ? element.name : "location " + (conference.organizations.indexOf(element) + 1),
                        type: element.type,
                        location: element.location,
                        start_date: element.start_date,
                        end_date: element.end_date,
                        CallForPaperCfpId: conference.cfp_id
                    }, { transaction: transaction });

                    await model.organizationModel.destroy({
                        where: {
                            name: isExisted.name,
                            status: "old",
                            CallForPaperCfpId: conference.cfp_id
                        }
                    }, { transaction: transaction });

                    await isExisted.update(
                        { status: "old" },
                        { transaction: transaction }
                    );

                    const oldNotes = await model.calenderNoteModel.findAll({ where: { OrganizationOrgId: isExisted.org_id } });
                    for (const oldNote of oldNotes) {
                        await oldNote.update({
                            date_value: [newOrganization.start_date, newOrganization.end_date].join(" to "),
                            OrganizationOrgId: newOrganization.org_id
                        }, { transaction: transaction });
                    }

                    // [#hc]
                    notifications.push({
                        title: process.env.TITLE_NEW_UPDATED_EVENT,
                        cfp_id: conference.cfp_id,
                        confName: conferenceDetail.Conference.conf_name,
                        detail: isExisted.end_date ?
                            '[UPDATED] Conference start from "' + formatDate(newOrganization.start_date) + ' to ' + formatDate(newOrganization.end_date) + '", location: "' + newOrganization.location + '", type: "' + newOrganization.type + '"'
                            : '[UPDATED] Conference start from "' + formatDate(newOrganization.start_date) + '", location: "' + newOrganization.location + '", type: "' + newOrganization.type + '"'
                    });
                }
            }
        }
        return notifications;

    } catch (error) {
        throw (error);
    }
};

const deleteOrganizationByID = async function (orgID, transaction) {
    try {
        const organization = await model.organizationModel.findByPk(orgID);
        if (organization && organization.status === "new") {
            return await model.organizationModel.destroy({ where: { name: organization.name, CallForPaperCfpId: organization.CallForPaperCfpId } }, { transaction: transaction });
        } else if (organization) {
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