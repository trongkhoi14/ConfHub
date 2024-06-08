const fs = require('fs');
const model = require('../models/index.js');
const sequelize = require('../config/database.js');
require('dotenv').config();

const conferenceData = {
    listOfConferences: []
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
                // owner: conference.owner,
                source: conference.Source.src_name,
                status: conference.status,
                fieldOfResearch: conference.CfpFors.map(CfpFor => { return CfpFor.FieldOfResearch.for_name }),
            },
            organizations: conference.Organizations,
            importantDates: conference.ImportantDates/*.filter(item => item.date_type.includes("sub") || submissionKeywords.includes(item.date_type))*/,
            // callForPaper: conference.content,
            // createdAt: conference.createdAt,
            updatedAt: conference.updatedAt,
        };

        return conferenceData;

    } catch (error) {
        throw (error);
    }
};

async function loadDataForFilter() {
    console.log('[' + new Date() + '] Collecting data to file data.json...');

    const conferenceIDs = await model.callForPaperModel.findAll({
        attributes: ['cfp_id'],
        order: [['updatedAt', 'DESC']]
    });

    const conferences = await Promise.all(conferenceIDs.map(async (id) => {
        return await selectCallForPaperForFilter(id.cfp_id);
    }));

    // const conferencesJSON = JSON.stringify(conferences, null, 2);

    // fs.writeFileSync('./src/temp/data.json', conferencesJSON);

    conferenceData.listOfConferences = [...conferences];

    console.log('[' + new Date() + '] Data has been written to data.json');
}

async function insertToList(cfp_id, list) {
    const newConference = await selectCallForPaperForFilter(cfp_id);
    if (newConference) {
        list.unshift(newConference);
    }
}

async function updateToList(cfp_id, list) {
    const newConference = await selectCallForPaperForFilter(cfp_id);
    if (newConference) {
        const index = list.findIndex(item => String(item.id) === String(cfp_id));
        list[index] = newConference;
    }
}

async function removeFromList(cfp_id, list) {
    const index = list.findIndex(item => String(item.id) === String(cfp_id));
    if (index !== -1) {
        list.splice(index, 1);
    }
}

module.exports = {
    loadDataForFilter,
    conferenceData,
    selectCallForPaperForFilter,
    insertToList,
    updateToList,
    removeFromList
}