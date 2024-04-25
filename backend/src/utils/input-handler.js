const model = require('../models/index.js');
const { Op } = require('sequelize');
const moment = require('moment');
require('dotenv').config();

function isEmpty(value) {
    return value === null || value === undefined || value === "" || value === false;
};

function containsEmptyValue(object, excludeProperties) {
    if (Array.isArray(object)) {
        if (object.length === 0) { return true };
        return object.some(item => containsEmptyValue(item, excludeProperties));

    } else if (typeof (object) === 'object' && object !== null) {
        if (Object.keys(object).length === 0) { return true };
        return Object.entries(object).some(([key, value]) => {
            if (excludeProperties && excludeProperties.includes(key)) return false;
            return containsEmptyValue(value, excludeProperties);
        });

    } else {
        return isEmpty(object);
    }
};

function getPagination(conditions) {
    return {
        page: conditions.page ? parseInt(conditions.page) : null,
        size: conditions.size ? parseInt(conditions.size) : null,
        offset: conditions.size && conditions.page ? ((conditions.page - 1) * conditions.size) : null
    }
};

function getConferenceName(conditions) {
    if (!isEmpty(conditions.search)) {
        return { "$Conference.conf_name$": { [Op.iLike]: `%${conditions.search}%` } };
    } else {
        return null;
    }
};

function getStatus(conditions) {
    if (conditions.status === "true") {
        return { status: true };
    } else if (conditions.status === "false") {
        return { status: false };
    } else if (conditions.status === "all") {
        return { status: { [Op.ne]: null } };
    }
};

function getConferenceDate(conditions) {
    if (isEmpty(conditions.confStart) && isEmpty(conditions.confEnd)) {
        return null;
    } else if (!isEmpty(conditions.confStart) && isEmpty(conditions.confEnd)) {
        return {
            "$Organizations.status$": "new",
            "$Organizations.start_date$": { [Op.gte]: moment(conditions.confStart).toDate() }
        }
    } else if (isEmpty(conditions.confStart) && !isEmpty(conditions.confEnd)) {
        return {
            "$Organizations.status$": "new",
            "$Organizations.end_date$": { [Op.lte]: moment(conditions.confEnd).toDate() }
        }
    } else if (!isEmpty(conditions.confStart) && !isEmpty(conditions.confEnd)) {
        return {
            "$Organizations.status$": "new",
            "$Organizations.start_date$": { [Op.gte]: moment(conditions.confStart).toDate() },
            "$Organizations.end_date$": { [Op.lte]: moment(conditions.confEnd).toDate() }
        }
    }
};

function getRating(conditions) {
    if (!isEmpty(conditions.rating)) {
        return { rating: { [Op.gte]: parseFloat(conditions.rating) } };
    } else {
        return null;
    }
};

function getRank(conditions) {
    if (!isEmpty(conditions.rank)) {
        return { rank: { [Op.eq]: conditions.rank } };
    } else {
        return null;
    }
};

function getAcronym(conditions) {
    if (!isEmpty(conditions.acronym)) {
        return { "$Conference.acronym$": { [Op.eq]: conditions.acronym } };
    } else {
        return null;
    }
};

async function getLocation(conditions) {
    if (!isEmpty(conditions.userID)) {
        const user = await model.userModel.findByPk(conditions.userID);
        if (user && user.location && conditions.location.toLowerCase() === "domestic") {
            const address = user.address.split(",").pop().trim();
            return {
                "$Organizations.status$": "new",
                "$Organizations.location$": { [Op.iLike]: `%${address}%` }
            };
        }
        else {
            return null;
        }
    } else {
        return null;
    }
};

function getSubmissionDate(conditions) {
    if (isEmpty(conditions.subStart) && isEmpty(conditions.subEnd)) {
        return null;
    } else if (!isEmpty(conditions.subStart) && isEmpty(conditions.subEnd)) {
        return {
            "$ImportantDates.status$": "new",
            "$ImportantDates.date_type$": { [Op.iLike]: `%${"sub"}%` },
            "$ImportantDates.date_value$": { [Op.between]: [moment().toDate(conditions.subStart), moment(process.env.MAX_DATE).toDate()] }
        }
    } else if (isEmpty(conditions.subStart) && !isEmpty(conditions.subEnd)) {
        return {
            "$ImportantDates.status$": "new",
            "$ImportantDates.date_type$": { [Op.iLike]: `%${"sub"}%` },
            "$ImportantDates.date_value$": { [Op.between]: [moment().toDate(process.env.MIN_DATE), moment(conditions.subEnd).toDate()] }
        }
    }
}

function getSource(conditions) {
    if (!isEmpty(conditions.source)) {
        return { "$Source.src_name$": conditions.source };
    } else {
        return null;
    }
}

function getConferenceType(conditions) {
    if (!isEmpty(conditions.type)) {
        return { "$Organizations.type$": conditions.type };
    } else {
        return null;
    }
}

function getFieldsOfResearch(conditions) {
    if (!isEmpty(conditions.fieldOfResearch)) {
        return { "$CfpFors.FieldOfResearch.for_name$": conditions.fieldOfResearch };
    } else {
        return null;
    }
}

function makeFilterCondition(compulsoryConditions, optionalConditions) {
    if (optionalConditions.length === 0) {
        return compulsoryConditions;
    } else {
        return {
            [Op.and]: [
                compulsoryConditions,
                {
                    [Op.or]: optionalConditions
                }
            ]
        }
    }
}

async function getFilterConditions(req) {
    try {
        let rawConditions = {
            userID: req.user?._id || req.body.id,
            page: req.query.page,
            size: req.query.size,
            search: req.query.search,
            subStart: req.query.subStart,
            subEnd: req.query.subEnd,
            type: req.query.type,
            confStart: req.query.confStart,
            confEnd: req.query.confEnd,
            location: req.query.location,
            acronym: req.query.acronym,
            source: req.query.source,
            rating: req.query.rating,
            rank: req.query.rank,
            fieldOfResearch: req.query.for,
            status: req.query.status || "true"
        }

        let pagination = getPagination(rawConditions);
        let name = getConferenceName(rawConditions);
        let status = getStatus(rawConditions);
        let conferenceDate = getConferenceDate(rawConditions);
        let rating = getRating(rawConditions);
        let rank = getRank(rawConditions);
        let acronym = getAcronym(rawConditions);
        let location = await getLocation(rawConditions);
        let subDate = getSubmissionDate(rawConditions);
        let source = getSource(rawConditions);
        let type = getConferenceType(rawConditions);
        let fieldOfResearch = getFieldsOfResearch(rawConditions);

        let compulsoryConditions = [];
        let optionalConditions = [];

        if (!isEmpty(status)) compulsoryConditions.push(status);
        if (!isEmpty(conferenceDate)) compulsoryConditions.push(conferenceDate);

        if (!isEmpty(name)) optionalConditions.push(name);
        if (!isEmpty(rating)) optionalConditions.push(rating);
        if (!isEmpty(rank)) optionalConditions.push(rank);
        if (!isEmpty(acronym)) optionalConditions.push(acronym);
        if (!isEmpty(location)) optionalConditions.push(location);
        if (!isEmpty(subDate)) optionalConditions.push(subDate);
        if (!isEmpty(source)) optionalConditions.push(source);
        if (!isEmpty(type)) optionalConditions.push(type);
        if (!isEmpty(fieldOfResearch)) optionalConditions.push(fieldOfResearch);

        let filter = makeFilterCondition(compulsoryConditions, optionalConditions)

        return {
            userID: rawConditions.userID,
            page: pagination.page,
            size: pagination.size,
            offset: pagination.offset,
            filter: filter
        }
    } catch (error) {
        throw (error);
    }
};

function getConferenceObject(req) {
    try {
        return {
            cfp_id: req.body.cfp_id || req.params?.id,
            name: req.body.conf_name,
            acronym: req.body.acronym,
            callForPaper: req.body.callForPaper,
            link: req.body.link,
            source: req.body.source || process.env.DEFAULT_SOURCE,
            rank: req.body.rank,
            owner: req.body.owner || "user",
            fieldsOfResearch: req.body.fieldsOfResearch || [],
            organizations: req.body.organizations || [],
            importantDates: req.body.importantDates || []
        }
    } catch (error) {
        throw (error);
    }
};

module.exports = {
    isEmpty,
    containsEmptyValue,
    getFilterConditions,
    getConferenceObject,
}