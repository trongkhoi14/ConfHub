const model = require('../models/index.js');
const SourceQuery = require("./source-queries");
const FieldOfResearchQuery = require("./for-queries");
const ConferenceQuery = require("./conference-queries");
const ImportantDatesQuery = require("./important-date-queries");
const OrganizationQuery = require("./organization-queries");
const sequelize = require('../config/database.js');
require('dotenv').config();

const selectAllCallForPapers = async function (filterConditions) {
    try {
        const conferenceIDs = await model.callForPaperModel.findAll({
            attributes: ['cfp_id'],
            distinct: true,
            group: ['cfp_id'],
            where: filterConditions.filter,
            include: [
                { model: model.sourceModel, as: "Source", required: false, duplicating: false, attributes: [] },
                { model: model.conferenceModel, as: "Conference", required: false, duplicating: false, attributes: [] },
                { model: model.importantDateModel, as: "ImportantDates", required: false, duplicating: false, attributes: [] },
                { model: model.organizationModel, as: "Organizations", required: false, duplicating: false, attributes: [] },
                {
                    model: model.cfpForModel, as: "CfpFors", required: false, duplicating: false, attributes: [],
                    include: { model: model.fieldOfResearchModel, as: "FieldOfResearch", required: false, duplicating: false, attributes: [] },
                }
            ],
            order: [['updatedAt', 'DESC']],
            limit: filterConditions.size,
            offset: filterConditions.offset
        });

        const conferences = Promise.all(conferenceIDs.map(async (id) => {
            return await selectCallForPaper(id.cfp_id);
        }));

        return conferences;

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

        const conferenceData = {
            id: conference.cfp_id,
            infomation: {
                name: conference.Conference.conf_name,
                acronym: conference.Conference.acronym,
                link: conference.link,
                rating: conference.rating,
                rank: conference.rank,
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
        };

        return conferenceData;

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
                updatedAt: new Date()
            },
            { where: { cfp_id: conference.cfp_id } },
            { transaction: transaction }
        );

        await model.cfpForModel.destroy({ where: { CallForPaperCfpId: conference.cfp_id } }, { transaction: transaction });
        await FieldOfResearchQuery.insertFieldsOfResearch(conference, transaction)
        await OrganizationQuery.updateOrganizations(conference, transaction);
        await ImportantDatesQuery.updateDates(conference, transaction);

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

module.exports = {
    selectAllCallForPapers,
    selectCallForPaper,
    insertCallForPaper,
    updateCallForPaper,
    deleteCallForPaper
};