const model = require('../models/index.js');
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const moment = require('moment');
require('dotenv').config();

const selectConferenceByCondition = async function (filterConditions) {
    try {
        const conferenceIDs = await model.callForPaperModel.findAll({
            attributes: ['cfp_id'],
            distinct: true,
            group: ['cfp_id'],
            where: {
                [Op.and]: [
                    { status: true },
                    {
                        "$ImportantDates.date_type$": filterConditions.date_type,
                        "$ImportantDates.date_value$": filterConditions.date_value
                    },
                    {
                        "$Organizations.start_date$": filterConditions.confStart,
                        "$Organizations.end_date$": filterConditions.confEnd
                    },
                    {
                        [Op.or]: [
                            { rating: filterConditions.rating },
                            { rank: filterConditions.rank },
                            { "$Source.src_name$": filterConditions.source },
                            { "$Conference.conf_name$": filterConditions.search },
                            { "$Conference.acronym$": filterConditions.acronym },
                            { "$Organizations.type$": filterConditions.type },
                            { "$Organizations.location$": filterConditions.location },
                            {
                                "$CfpFors.FieldOfResearch.for_name$": filterConditions.fieldOfResearch
                            }
                        ]
                    }
                ]
            },
            include: [
                { model: model.sourceModel, as: "Source", required: true, duplicating: false, attributes: [] },
                { model: model.conferenceModel, as: "Conference", required: true, duplicating: false, attributes: [] },
                { model: model.importantDateModel, as: "ImportantDates", required: false, duplicating: false, attributes: [] },
                { model: model.organizationModel, as: "Organizations", required: false, duplicating: false, attributes: [] },
                {
                    model: model.cfpForModel, as: "CfpFors", required: true, duplicating: false, attributes: [],
                    include: { model: model.fieldOfResearchModel, as: "FieldOfResearch", required: true, duplicating: false, attributes: [] },
                }
            ],
            order: [['updatedAt', 'DESC']],
            limit: filterConditions.size,
            offset: filterConditions.offset
        });
        const conferences = Promise.all(conferenceIDs.map(async (id) => {
            return await selectConferenceByID(id.cfp_id)
        }));
        return conferences;

    } catch (error) {
        throw (error);
    }
};

const selectConferenceByID = async function (conferenceID) {
    try {
        const conference = await model.callForPaperModel.findByPk(conferenceID, {
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
                    attributes: { exclude: ['date_id', 'CallForPaperCfpId'] }
                },
                {
                    model: model.organizationModel,
                    attributes: { exclude: ['org_id', 'CallForPaperCfpId'] }
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

/**
 * @param {Object} conference
 * @param {string} conference.name
 * @param {string} conference.acronym
 * @param {string} conference.link
 * @param {string} conference.source
 * @param {string} conference.rank
 * @param {string[]} conference.fieldsOfResearch
 * @param {Object[]} conference.organizations
 * @param {Object[]} conference.importantDates
 * @param {string} conference.callForPaper
 * @param {Object} user
 */
const insertConference = async function (conference, user) {
    try {
        const res = await sequelize.transaction(async (t) => {
            const [src] = await model.sourceModel.findOrCreate({
                where: { src_name: conference.source },
                defaults: { src_name: conference.source },
                transaction: t
            });

            const [conf] = await model.conferenceModel.findOrCreate({
                where: { conf_name: conference.name, acronym: conference.acronym },
                defaults: { conf_name: conference.name, acronym: conference.acronym },
                transaction: t
            });

            const cfp = await model.callForPaperModel.create({
                content: conference.callForPaper,
                link: conference.link,
                rank: conference.rank,
                owner: user.role,
                ConferenceConfId: conf.conf_id,
                SourceSrcId: src.src_id
            }, { transaction: t });

            if (cfp) {
                const organiztions = conference.organizations.map(element => {
                    return {
                        type: element.type,
                        location: element.location,
                        start_date: element.start_date,
                        end_date: element.end_date,
                        CallForPaperCfpId: cfp.cfp_id
                    }
                });
                await model.organizationModel.bulkCreate(organiztions, { transaction: t });

                const importantDates = conference.importantDates.map(element => {
                    return {
                        date_type: element.date_type,
                        date_value: element.date_value,
                        CallForPaperCfpId: cfp.cfp_id
                    }
                });
                await model.importantDateModel.bulkCreate(importantDates, { transaction: t });

                for (const element of conference.fieldsOfResearch) {
                    const isExisted = await model.fieldOfResearchModel.findOne({ where: { for_name: element } });
                    if (isExisted) {
                        await model.cfpForModel.create({ CallForPaperCfpId: cfp.cfp_id, FieldOfResearchForId: isExisted.for_id }, { transaction: t });
                    } else {
                        const newFOR = await model.fieldOfResearchModel.create({ for_name: element }, { transaction: t });
                        await model.cfpForModel.create({ CallForPaperCfpId: cfp.cfp_id, FieldOfResearchForId: newFOR.for_id }, { transaction: t });
                    };
                };

                await model.postModel.create({ post_time: new Date(), UserId: user.id, CallForPaperCfpId: cfp.cfp_id }, { transaction: t });
            }
        });
    } catch (error) {
        throw (error);
    }
};

/**
 * @param {Object} conference
 * @param {string} conference.link
 * @param {string} conference.source
 * @param {string} conference.rank
 * @param {string[]} conference.fieldsOfResearch
 * @param {Object[]} conference.organizations
 * @param {Object[]} conference.importantDates
 * @param {string} conference.callForPaper
 */
const updateConference = async function (conferenceID, conference) {
    try {
        await sequelize.transaction(async (t) => {
            await model.callForPaperModel.update(
                {
                    content: conference.callForPaper,
                    link: conference.link,
                    rank: conference.rank,
                    updatedAt: new Date()
                },
                { where: { cfp_id: conferenceID } },
                { transaction: t }
            );

            await model.cfpForModel.destroy({ where: { CallForPaperCfpId: conferenceID } }, { transaction: t });
            await model.organizationModel.destroy({ where: { CallForPaperCfpId: conferenceID } }, { transaction: t });

            const organiztions = conference.organizations.map(element => {
                return {
                    type: element.type,
                    location: element.location,
                    start_date: element.start_date,
                    end_date: element.end_date,
                    CallForPaperCfpId: conferenceID
                }
            });
            await model.organizationModel.bulkCreate(organiztions, { transaction: t });

            const newImportantDates = conference.importantDates.map(element => {
                return {
                    date_type: element.date_type,
                    date_value: element.date_value,
                    CallForPaperCfpId: conferenceID
                }
            });

            for (const element of newImportantDates) {
                const isExisted = await model.importantDateModel.findOne({
                    where: {
                        date_type: element.date_type,
                        status: "new",
                        CallForPaperCfpId: conferenceID
                    }
                });

                if (isExisted && !(moment(isExisted.date_value)).isSame(moment(element.date_value))) {
                    await isExisted.update(
                        { status: "old" },
                        {
                            where: {
                                status: "new",
                                CallForPaperCfpId: conferenceID
                            }
                        },
                        { transaction: t }
                    );
                    await model.importantDateModel.create({
                        date_type: element.date_type,
                        date_value: element.date_value,
                        CallForPaperCfpId: conferenceID
                    }, { transaction: t });

                } else if (!isExisted) {
                    await model.importantDateModel.create({
                        date_type: element.date_type,
                        date_value: element.date_value,
                        CallForPaperCfpId: conferenceID
                    }, { transaction: t });
                };
            };

            for (const element of conference.fieldsOfResearch) {
                const isExisted = await model.fieldOfResearchModel.findOne({ where: { for_name: element } });
                if (isExisted) {
                    await model.cfpForModel.create({ CallForPaperCfpId: conferenceID, FieldOfResearchForId: isExisted.for_id }, { transaction: t });
                } else {
                    const newFOR = await model.fieldOfResearchModel.create({ for_name: element }, { transaction: t });
                    await model.cfpForModel.create({ CallForPaperCfpId: conferenceID, FieldOfResearchForId: newFOR.for_id }, { transaction: t });
                };
            };
        });
    } catch (error) {
        throw (error);
    }
};

const deleteConferenceByID = async function (conferenceID) {
    try {
        await sequelize.transaction(async (t) => {
            await model.callForPaperModel.destroy({ where: { cfp_id: conferenceID } }, { transaction: t });
        });
    } catch (error) {
        throw (error);
    }
};

module.exports = {
    selectConferenceByCondition,
    selectConferenceByID,
    insertConference,
    updateConference,
    deleteConferenceByID
}