const model = require('../models/index.js');
const SourceQuery = require("./source-queries");
const FieldOfResearchQuery = require("./for-queries");
const ConferenceQuery = require("./conference-queries");
const ImportantDatesQuery = require("./important-date-queries");
const OrganizationQuery = require("./organization-queries");
const sequelize = require('../config/database.js');
const { submissionKeywords } = require('../keyword/index.js');
const { Op } = require('sequelize');
const { sendNotifications } = require('../services/notification-services.js');
const { conferenceData } = require('../temp/index.js');
require('dotenv').config();

const selectAllCallForPapers = async function (filterConditions) {
    try {
        // const filterResults = await model.callForPaperModel.findAll({
        //     attributes: ['cfp_id'],
        //     // where: filterConditions.filter,
        //     // include: [
        //     //     { model: model.sourceModel, as: "Source", required: false, duplicating: false, attributes: [] },
        //     //     { model: model.conferenceModel, as: "Conference", required: false, duplicating: false, attributes: [] },
        //     //     { model: model.importantDateModel, as: "ImportantDates", required: false, duplicating: false, attributes: [] },
        //     //     { model: model.organizationModel, as: "Organizations", required: false, duplicating: false, attributes: [] },
        //     //     {
        //     //         model: model.fieldOfResearchModel, as: "FieldOfResearches", required: false, duplicating: false, attributes: [],
        //     //         include: { model: model.cfpForModel, as: "CfpFors", required: false, duplicating: false, attributes: [] },
        //     //     }
        //     // ],
        //     // order: order,
        //     // limit: filterConditions.size,
        //     // offset: filterConditions.offset,
        // });

        // const conferenceIDs = filterResults.map(item => item.cfp_id);
        // const conferences = await Promise.all(conferenceIDs.map(async (id) => {
        //     return await selectCallForPaperForFilter(id);
        // }));

        const status = filterConditions.raw.status;
        let conferences = [...conferenceData.listOfConferences];

        if (status === 'true' || status === 'false') {
            conferences = conferences.filter(i => String(i.information.status) === String(status));
        }

        const maxRecords = conferences.length;

        return {
            maxRecords: maxRecords,
            maxPages: Math.ceil(maxRecords / filterConditions.size),
            size: filterConditions.size,
            currentPage: filterConditions.page,
            count: conferences.length,
            data: conferences
        }

    } catch (error) {
        throw (error);
    }
};

const selectCallForPaperForFilter = async function (cfpID) {
    try {
        const conference = await model.callForPaperModel.findByPk(cfpID, {
            include: [
                {
                    model: model.sourceModel,
                    attributes: ['src_name']
                },
                {
                    model: model.conferenceModel,
                    attributes: { exclude: ['conf_id'] }
                },
                {
                    model: model.importantDateModel,
                    attributes: { exclude: ['CallForPaperCfpId'] },
                },
                {
                    model: model.organizationModel,
                    attributes: { exclude: ['CallForPaperCfpId'] }
                },
                {
                    model: model.cfpForModel,
                    include: {
                        model: model.fieldOfResearchModel,
                        attributes: ['for_name']
                    }
                }
            ]
        });

        const conferenceData = {
            id: conference.cfp_id,
            information: {
                name: conference.Conference.conf_name,
                acronym: conference.Conference.acronym,
                // link: conference.link,
                rating: conference.rating,
                rank: conference.rank,
                nkey: conference.nkey,
                // owner: conference.owner,
                source: conference.Source.src_name,
                status: conference.status,
                fieldOfResearch: conference.CfpFors.map(CfpFor => { return CfpFor.FieldOfResearch.for_name }),
            },
            organizations: conference.Organizations,
            importantDates: conference.ImportantDates/*.filter(item => item.date_type.includes("sub") || submissionKeywords.includes(item.date_type))*/,
            // callForPaper: conference.content,
            createdAt: conference.createdAt,
            updatedAt: conference.updatedAt,
            view: conference.view
        };

        return conferenceData;

    } catch (error) {
        throw (error);
    }
};

const selectCallForPaper = async function (cfpID) {
    try {
        const conference = await model.callForPaperModel.findByPk(cfpID, {
            include: [
                {
                    model: model.sourceModel,
                    attributes: ['src_name']
                },
                {
                    model: model.conferenceModel,
                    attributes: { exclude: ['conf_id'] }
                },
                {
                    model: model.importantDateModel,
                    attributes: { exclude: ['CallForPaperCfpId'] }
                },
                {
                    model: model.organizationModel,
                    attributes: { exclude: ['CallForPaperCfpId'] }
                },
                {
                    model: model.cfpForModel,
                    include: {
                        model: model.fieldOfResearchModel,
                        attributes: ['for_name']
                    }
                }
            ]
        });

        const data = {
            id: conference.cfp_id,
            information: {
                name: conference.Conference.conf_name,
                acronym: conference.Conference.acronym,
                link: conference.link,
                rating: conference.rating,
                rank: conference.rank,
                nkey: conference.nkey,
                owner: conference.owner,
                source: conference.Source.src_name,
                status: conference.status,
                fieldOfResearch: conference.CfpFors.map(CfpFor => { return CfpFor.FieldOfResearch.for_name }),
            },
            organizations: conference.Organizations,
            importantDates: conference.ImportantDates,
            callForPaper: conference.content,
            createdAt: conference.createdAt,
            updatedAt: conference.updatedAt,
            view: conference.view
        };

        if (conference.status == true) {
            conference.view = conference.view + 1;
            await conference.save();
            const index = conferenceData.listOfConferences.findIndex(item => String(item.id) === String(conference.cfp_id));
            conferenceData.listOfConferences[index].view = conference.view;
        }


        return data;

    } catch (error) {
        throw (error);
    }
};

const insertCallForPaper = async function (conference, transaction) {
    try {
        const [src] = await SourceQuery.insertSource(conference.source, transaction);
        const [conf] = await ConferenceQuery.insertConference(conference, transaction);
        const cfp = await model.callForPaperModel.create({
            content: conference.callForPaper,
            link: conference.link,
            rank: conference.rank,
            owner: conference.owner,
            nkey: conference.nkey,
            status: conference.status || false,
            ConferenceConfId: conf.conf_id,
            SourceSrcId: src.src_id
        }, { transaction: transaction });

        conference.cfp_id = cfp.cfp_id;

        if (cfp) {
            await OrganizationQuery.insertOrganizations(conference, transaction);
            await ImportantDatesQuery.insertDates(conference, transaction);
            await FieldOfResearchQuery.insertFieldsOfResearch(conference, transaction);
        }

        return cfp;

    } catch (error) {
        throw (error);
    }
};

const updateCallForPaper = async function (conference, transaction) {
    try {
        await model.callForPaperModel.update(
            {
                content: conference.callForPaper,
                link: conference.link,
                rank: conference.rank,
                // status: conference.status,
                updatedAt: new Date()
            },
            { where: { cfp_id: conference.cfp_id } },
            { transaction: transaction }
        );

        await model.cfpForModel.destroy({ where: { CallForPaperCfpId: conference.cfp_id } }, { transaction: transaction });
        await FieldOfResearchQuery.insertFieldsOfResearch(conference, transaction)
        const notifications1 = await OrganizationQuery.updateOrganizations(conference, transaction);
        const notifications2 = await ImportantDatesQuery.updateDates(conference, transaction);

        const notifications = [...notifications1, ...notifications2];
        sendNotifications(notifications);

        return true;

    } catch (error) {
        throw (error);
    }
};

const deleteCallForPaper = async function (cfpID) {
    try {
        return await sequelize.transaction(async (t) => {
            await model.callForPaperModel.destroy({ where: { cfp_id: cfpID } }, { transaction: t });
            return true;
        });
    } catch (error) {
        throw (error);
    }
};

function findTopView(arr, k) {
    const sortArr = arr.slice().sort((a, b) => b.view - a.view);
    let result = sortArr.slice(0, k);
    return result;
}

module.exports = {
    selectAllCallForPapers,
    selectCallForPaper,
    insertCallForPaper,
    updateCallForPaper,
    deleteCallForPaper,
    selectCallForPaperForFilter,
    findTopView
};