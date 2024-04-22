const { Op } = require('sequelize');
const moment = require('moment');
require('dotenv').config();

function isEmpty(value) {
    return value === null || value === undefined || value === "" || value === false;
};

function containsEmptyValue(object) {
    if (Array.isArray(object)) {
        if (object.length === 0) { return true };
        return object.some(item => containsEmptyValue(item));
    } else if (typeof (object) === 'object' && object !== null) {
        if (Object.keys(object).length === 0) { return true };
        return Object.values(object).some(value => containsEmptyValue(value));
    } else {
        return isEmpty(object);
    }
};

function makeFilterConditions(params) {
    return {
        page: params.page,
        size: params.size !== process.env.DEFAULT_SIZE ? params.size : null,
        offset: params.size !== process.env.DEFAULT_SIZE ? ((params.page - 1) * params.size) : params.offset,
        search: params.search !== process.env.DEFAULT_CONDITION_VALUE ? { [Op.iLike]: `%${params.search}%` } : { [Op.ne]: null },
        date_type: params.date_type !== process.env.DEFAULT_CONDITION_VALUE ? { [Op.iLike]: `%${params.date_type}%` } : { [Op.ne]: null },
        date_value: { [Op.between]: [moment(params.subStart).toDate(), moment(params.subEnd).toDate()] },
        type: params.type !== process.env.DEFAULT_CONDITION_VALUE ? params.type : { [Op.ne]: null },
        confStart: { [Op.gte]: moment(params.confStart).toDate() },
        confEnd: { [Op.lte]: moment(params.confEnd).toDate() },
        location: params.location !== process.env.DEFAULT_CONDITION_VALUE ? { [Op.iLike]: `%${params.location}%` } : { [Op.ne]: null },
        acronym: params.acronym !== process.env.DEFAULT_CONDITION_VALUE ? params.acronym : { [Op.ne]: null },
        source: params.source !== process.env.DEFAULT_CONDITION_VALUE ? params.source : { [Op.ne]: null },
        rating: { [Op.gte]: parseFloat(params.rating) },
        rank: params.rank !== process.env.DEFAULT_CONDITION_VALUE ? params.rank : { [Op.ne]: null },
        fieldOfResearch: params.fieldOfResearch !== process.env.DEFAULT_CONDITION_VALUE ? params.fieldOfResearch : { [Op.ne]: null }
    }
};

function makeConferenceObject(params) {
    return {
        name: params.conf_name,
        acronym: params.acronym,
        link: params.link,
        source: params.source || process.env.DEFAULT_SOURCE,
        rank: params.rank || process.env.DEFAULT_RANK,
        fieldsOfResearch: params.fieldsOfResearch || [],
        organizations: params.organizations || [],
        importantDates: params.importantDates || [],
        callForPaper: params.callForPaper
    }
};

module.exports = {
    containsEmptyValue,
    makeFilterConditions,
    makeConferenceObject,

}