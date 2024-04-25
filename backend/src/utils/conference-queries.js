const model = require('../models/index.js');
require('dotenv').config();

const selectAllAcronyms = async function () {
    try {
        return await model.conferenceModel.findAll({ attributes: ['acronym'] });
    } catch (error) {
        throw (error);
    }
};

const selectConference = async function (conferenceID) {
    try {
        return await model.conferenceModel.findByPk(conferenceID);
    } catch (error) {
        throw (error);
    }
};

const insertConference = async function (conference, transaction) {
    try {
        return await model.conferenceModel.findOrCreate({
            where: { conf_name: conference.name, acronym: conference.acronym },
            defaults: { conf_name: conference.name, acronym: conference.acronym },
            transaction: transaction
        });
    } catch (error) {
        throw (error);
    }
};

module.exports = {
    selectAllAcronyms,
    selectConference,
    insertConference
};