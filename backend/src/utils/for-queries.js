const model = require('../models/index.js');
require('dotenv').config();

const selectAllFieldsOfResearch = async function () {
    try {
        return await model.fieldOfResearchModel.findAll();
    } catch (error) {
        throw (error);
    }
};

const insertFieldsOfResearch = async function (conference, transaction) {
    try {
        for (const element of conference.fieldsOfResearch) {
            const isExisted = await model.fieldOfResearchModel.findOne({ where: { for_name: element } });
            if (isExisted) {
                await model.cfpForModel.create({ CallForPaperCfpId: conference.cfp_id, FieldOfResearchForId: isExisted.for_id }, { transaction: transaction });
            } else {
                const newFOR = await model.fieldOfResearchModel.create({ for_name: element }, { transaction: transaction });
                await model.cfpForModel.create({ CallForPaperCfpId: conference.cfp_id, FieldOfResearchForId: newFOR.for_id }, { transaction: transaction });
            };
        };
        return true;

    } catch (error) {
        throw (error);
    }
};

module.exports = {
    selectAllFieldsOfResearch,
    insertFieldsOfResearch
};