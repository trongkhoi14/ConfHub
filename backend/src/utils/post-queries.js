const model = require('../models/index.js');
const CallForPaperQuery = require('./cfp-queries.js');
const sequelize = require('../config/database.js');
require('dotenv').config();

const selectAllPosts = async function (filterConditions) {
    try {
        const postedConferenceIDs = await model.postModel.findAndCountAll({
            attributes: ['CallForPaperCfpId'],
            where: { UserId: filterConditions.userID },
            limit: filterConditions.size,
            offset: filterConditions.offset
        });

        const postedConferences = await Promise.all(postedConferenceIDs.rows.map(async (id) => {
            return await CallForPaperQuery.selectCallForPaper(id.CallForPaperCfpId);
        }));

        const maxRecords = postedConferenceIDs.count
        return {
            maxRecords: maxRecords,
            maxPages: Math.ceil(maxRecords / filterConditions.size),
            size: filterConditions.size,
            currentPage: filterConditions.page,
            count: postedConferences.length,
            data: postedConferences
        }

    } catch (error) {
        throw (error);
    }
};

const insertPost = async function (conference) {
    try {
        return await sequelize.transaction(async (t) => {
            const cfp = await CallForPaperQuery.insertCallForPaper(conference, t);
            if (conference.userID) {
                await model.postModel.create(
                    {
                        post_time: new Date(),
                        UserId: conference.userID,
                        CallForPaperCfpId: cfp.cfp_id
                    },
                    { transaction: t });
            }
            return true;
        });

    } catch (error) {
        throw (error);
    }
};

const updatePost = async function (conference) {
    try {
        return await sequelize.transaction(async (t) => {
            await CallForPaperQuery.updateCallForPaper(conference, t);
            return true;
        });
    } catch (error) {
        throw (error);
    }
};

const deletePost = async function (cfpID) {
    try {
        return await CallForPaperQuery.deleteCallForPaper(cfpID);
    } catch (error) {
        throw (error);
    }
};

module.exports = {
    selectAllPosts,
    insertPost,
    updatePost,
    deletePost
};