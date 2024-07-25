const model = require('../models/index.js');
require('dotenv').config();

const selectAllSources = async function () {
    try {
        return await model.sourceModel.findAll();
    } catch (error) {
        throw (error);
    }
};

const insertSource = async function (source, transaction) {
    try {
        return await model.sourceModel.findOrCreate({
            where: { src_name: source },
            defaults: { src_name: source },
            transaction: transaction
        });
    } catch (error) {
        throw (error);
    }
};

module.exports = {
    selectAllSources,
    insertSource
};