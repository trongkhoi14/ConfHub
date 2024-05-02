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

async function getUser(conditions) {
    if (!isEmpty(conditions.userID)) {
        return await model.userModel.findByPk(conditions.userID);
    } else {
        return null;
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
            "$Organizations.start_date$": { [Op.gte]: moment.utc(conditions.confStart).toDate() }
        }
    } else if (isEmpty(conditions.confStart) && !isEmpty(conditions.confEnd)) {
        return {
            "$Organizations.status$": "new",
            "$Organizations.end_date$": { [Op.lte]: moment.utc(conditions.confEnd).toDate() }
        }
    } else if (!isEmpty(conditions.confStart) && !isEmpty(conditions.confEnd)) {
        return {
            "$Organizations.status$": "new",
            "$Organizations.start_date$": { [Op.gte]: moment.utc(conditions.confStart).toDate() },
            "$Organizations.end_date$": { [Op.lte]: moment.utc(conditions.confEnd).toDate() }
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
    if (!containsEmptyValue(conditions.rank)) {
        const ranks = conditions.rank.map(item => item.toUpperCase());
        return { rank: { [Op.in]: ranks } };
    } else {
        return null;
    }
};

function getAcronym(conditions) {
    if (!containsEmptyValue(conditions.acronym)) {
        const acronyms = conditions.acronym.map(acronym => ({
            "$Conference.acronym$": { [Op.iLike]: `%${acronym}%` }
        }));
        return { [Op.or]: acronyms };

    } else {
        return null;
    }
};

function getLocation(conditions) {
    if (!containsEmptyValue(conditions.location)) {
        if (!isEmpty(conditions.user) && conditions.user.address && conditions.location.includes("Domestic")) {
            const address = conditions.user.address.split(",").pop().trim();
            conditions.location.push(address);
        };

        conditions.location = conditions.location.filter(item => item !== "Domestic");
        const locations = conditions.location.map(location => ({
            "$Organizations.location$": { [Op.iLike]: `%${location}%` }
        }));

        return {
            "$Organizations.status$": "new",
            [Op.or]: locations
        };

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
            "$ImportantDates.date_value$": { [Op.between]: [moment.utc(conditions.subStart).toDate(), moment.utc(process.env.MAX_DATE).toDate()] }
        }
    } else if (isEmpty(conditions.subStart) && !isEmpty(conditions.subEnd)) {
        return {
            "$ImportantDates.status$": "new",
            "$ImportantDates.date_type$": { [Op.iLike]: `%${"sub"}%` },
            "$ImportantDates.date_value$": { [Op.between]: [moment.utc(process.env.MIN_DATE).toDate(), moment.utc(conditions.subEnd).toDate()] }
        }
    } else if (!isEmpty(conditions.subStart) && !isEmpty(conditions.subEnd)) {
        return {
            "$ImportantDates.status$": "new",
            "$ImportantDates.date_type$": { [Op.iLike]: `%${"sub"}%` },
            "$ImportantDates.date_value$": { [Op.between]: [moment.utc(conditions.subStart).toDate(), moment.utc(conditions.subEnd).toDate()] }
        }
    }
};

function getSource(conditions) {
    if (!containsEmptyValue(conditions.source)) {
        const sources = conditions.source.map(source => ({
            "$Source.src_name$": { [Op.iLike]: `%${source}%` }
        }));
        return { [Op.or]: sources };

    } else {
        return null;
    }
};

function getConferenceType(conditions) {
    if (!containsEmptyValue(conditions.type)) {
        const types = conditions.type.map(type => ({
            "$Organizations.type$": { [Op.iLike]: `${type}` }
        }));
        return { [Op.or]: types };

    } else {
        return null;
    }
};

function getFieldsOfResearch(conditions) {
    if (!containsEmptyValue(conditions.fieldOfResearch)) {
        const fors = conditions.fieldOfResearch.map(fieldOfResearch => ({
            "$CfpFors.FieldOfResearch.for_name$": { [Op.iLike]: `%${fieldOfResearch}%` }
        }));
        return { [Op.or]: fors };

    } else {
        return null;
    }
};

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
};

async function getFilterConditions(req) {
    try {
        let rawConditions = {
            userID: req.user?._id,
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

        rawConditions.user = await getUser(rawConditions);
        let pagination = getPagination(rawConditions);
        let name = getConferenceName(rawConditions);
        let status = getStatus(rawConditions);
        let conferenceDate = getConferenceDate(rawConditions);
        let rating = getRating(rawConditions);
        let rank = getRank(rawConditions);
        let acronym = getAcronym(rawConditions);
        let location = getLocation(rawConditions);
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

        let filter = makeFilterCondition(compulsoryConditions, optionalConditions);

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

function getNote(req) {
    try {
        return {
            noteID: req.params?.id,
            note: req.body.note,
            date_value: req.body.date_value,
            UserId: req.user?._id,
            ImportantDateDateId: req.body.dateID,
            OrganizationOrgId: req.body.orgID
        }
    } catch (error) {
        throw (error);
    }
}

function getSetting(req) {
    try {
        return {
            userID: req.user?._id,
            name: req.body.name,
            value: req.body.value,
            status: req.body.status
        }
    } catch (error) {
        throw (error);
    }
}

module.exports = {
    isEmpty,
    containsEmptyValue,
    getFilterConditions,
    getConferenceObject,
    getNote,
    getSetting
}