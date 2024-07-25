const model = require('../models/index.js');
const { Op } = require('sequelize');
const moment = require('moment');
const sequelize = require('../config/database.js');
const { submissionKeywords } = require('../keyword/index.js');
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
        page: conditions.page ? parseInt(conditions.page) : 1,
        size: conditions.size ? parseInt(conditions.size) : 7,
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
            "$Conference.acronym$": { [Op.eq]: `%${acronym}%` }
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
            "$ImportantDates.date_type$": {
                [Op.or]: [
                    { [Op.iLike]: `%${"sub"}%` },
                    // { [Op.in]: submissionKeywords }
                ]
            },
            "$ImportantDates.date_value$": { [Op.between]: [moment.utc(conditions.subStart).toDate(), moment.utc(process.env.MAX_DATE).toDate()] }
        }
    } else if (isEmpty(conditions.subStart) && !isEmpty(conditions.subEnd)) {
        return {
            "$ImportantDates.status$": "new",
            "$ImportantDates.date_type$": {
                [Op.or]: [
                    { [Op.iLike]: `%${"sub"}%` },
                    // { [Op.in]: submissionKeywords }
                ]
            },
            "$ImportantDates.date_value$": { [Op.between]: [moment.utc(process.env.MIN_DATE).toDate(), moment.utc(conditions.subEnd).toDate()] }
        }
    } else if (!isEmpty(conditions.subStart) && !isEmpty(conditions.subEnd)) {
        return {
            "$ImportantDates.status$": "new",
            "$ImportantDates.date_type$": {
                [Op.or]: [
                    { [Op.iLike]: `%${"sub"}%` },
                    // { [Op.in]: submissionKeywords }
                ]
            },
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

function createPriority(priorityArr, order) {
    while (priorityArr.length > 0) {
        const priority = priorityArr.shift();

        if (priority !== null && priority !== undefined) {
            const attribute = priority[0];
            const values = priority[1];

            if (attribute === 'p_search') {
                order.push([sequelize.literal(`CASE WHEN "Conference".conf_name ILIKE '%${values}%' THEN 0 ELSE 1 END`), 'ASC']);

            } else if (attribute === 'p_subStart') {
                // const tuples = submissionKeywords.map(item => `'${item.replace(/'/g, "''")}'`).join(", ");
                const indexToRemove = priorityArr.findIndex(item => item[0] === 'p_subEnd');
                if (indexToRemove !== -1) {
                    const removedElement = priorityArr.splice(indexToRemove, 1);
                    const pEndValue = removedElement[0][1];
                    order.push([sequelize.literal(`CASE WHEN "ImportantDates".status = 'new' AND ("ImportantDates".date_type ILIKE '%sub%') AND "ImportantDates".date_value >= '${values}' AND "ImportantDates".date_value <= '${pEndValue}' THEN 0 ELSE 1 END`), 'ASC']);
                } else {
                    order.push([sequelize.literal(`CASE WHEN "ImportantDates".status = 'new' AND ("ImportantDates".date_type ILIKE '%sub%') AND "ImportantDates".date_value >= '${values}' AND "ImportantDates".date_value <= '2050-01-01' THEN 0 ELSE 1 END`), 'ASC']);
                }

            } else if (attribute === 'p_type') {
                const tuples = values.map(item => `'${item.replace(/'/g, "''")}'`).join(", ");
                order.push([sequelize.literal(`CASE WHEN "Organizations".status = 'new' AND "Organizations".type IN (${tuples}) THEN 0 ELSE 1 END`), 'ASC']);

            } else if (attribute === 'p_confStart') {
                const indexToRemove = priorityArr.findIndex(item => item[0] === 'p_confEnd');
                if (indexToRemove !== -1) {
                    const removedElement = priorityArr.splice(indexToRemove, 1);
                    const pEndValue = removedElement[0][1];
                    order.push([sequelize.literal(`CASE WHEN "Organizations".status = 'new' AND "Organizations".start_date >= '${values}' AND "Organizations".end_date <= '${pEndValue}' THEN 0 ELSE 1 END`), 'ASC']);
                } else {
                    order.push([sequelize.literal(`CASE WHEN "Organizations".status = 'new' AND "Organizations".start_date >= '${values}' AND "Organizations".end_date <= '2050-01-01' THEN 0 ELSE 1 END`), 'ASC']);
                }

            } else if (attribute === 'p_location') {
                for (let i of values) {
                    order.push([sequelize.literal(`CASE WHEN "Organizations".status = 'new' AND "Organizations".location ILIKE '%${i}%' THEN 0 ELSE 1 END`), 'ASC']);
                }

            } else if (attribute === 'p_acronym') {
                const tuples = values.map(item => `'${item.replace(/'/g, "''")}'`).join(", ");
                order.push([sequelize.literal(`CASE WHEN "Conference".conf_name IN (${tuples}) THEN 0 ELSE 1 END`), 'ASC']);

            } else if (attribute === 'p_source') {
                const tuples = values.map(item => `'${item.replace(/'/g, "''")}'`).join(", ");
                order.push([sequelize.literal(`CASE WHEN "Source".src_name IN (${tuples}) THEN 0 ELSE 1 END`), 'ASC']);

            } else if (attribute === 'p_rating') {
                for (let i of values) {
                    order.push([sequelize.literal(`CASE WHEN "CallForPaper".rating >= '${i}' THEN 0 ELSE 1 END`), 'ASC']);
                }

            } else if (attribute === 'p_rank') {
                const tuples = values.map(item => `'${item.replace(/'/g, "''")}'`).join(", ");
                order.push([sequelize.literal(`CASE WHEN "CallForPaper".rank IN (${tuples}) THEN 0 ELSE 1 END`), 'ASC']);

            } else if (attribute === 'p_for') {
                const tuples = values.map(item => `'${item.replace(/'/g, "''")}'`).join(", ");
                order.push([sequelize.literal(`CASE WHEN "FieldOfResearches".for_name IN (${tuples}) THEN 0 ELSE 1 END`), 'ASC']);
            }
        }
    }

    return true;
}

async function getOrder(req) {
    const priorities = Object.fromEntries(
        Object.entries(req.query).filter(([key, value]) => key.startsWith('p_'))
    );

    let order = [];

    const priorityArr = Object.entries(priorities).map((i) => i);
    createPriority(priorityArr, order);

    const orderType = req.query.order || 'r';
    if (orderType.toLowerCase() === 'n') {
        order.push(['Conference', 'conf_name', 'ASC']);
    } else if (orderType.toLowerCase() === 'u') {
        order.push([sequelize.literal(`CASE WHEN "Organizations".status = 'new' AND "Organizations".start_date >= CURRENT_DATE THEN start_date END`), 'ASC']);
    } else if (orderType.toLowerCase() === 'p') {
        // here
    }

    order.push(['updatedAt', 'DESC']);

    return order;
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

        // compulsory
        if (!isEmpty(status)) compulsoryConditions.push(status);
        if (!isEmpty(conferenceDate)) compulsoryConditions.push(conferenceDate);
        if (!isEmpty(name)) compulsoryConditions.push(name);
        if (!isEmpty(rating)) compulsoryConditions.push(rating);
        if (!isEmpty(rank)) compulsoryConditions.push(rank);
        if (!isEmpty(acronym)) compulsoryConditions.push(acronym);
        if (!isEmpty(location)) compulsoryConditions.push(location);
        if (!isEmpty(subDate)) compulsoryConditions.push(subDate);
        if (!isEmpty(source)) compulsoryConditions.push(source);
        if (!isEmpty(type)) compulsoryConditions.push(type);
        if (!isEmpty(fieldOfResearch)) compulsoryConditions.push(fieldOfResearch);

        // optional

        let filter = makeFilterCondition(compulsoryConditions, optionalConditions);

        return {
            userID: rawConditions.userID,
            page: pagination.page,
            size: pagination.size,
            offset: pagination.offset,
            filter: filter,
            raw: rawConditions
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
            rank: req.body.rank || 'N/I',
            owner: req.body.owner,
            nkey: req.body.nkey || null,
            // status: req.body.status || false,
            fieldsOfResearch: req.body.fieldsOfResearch || [],
            organizations: req.body.organizations || [],
            importantDates: req.body.importantDates || [],
            duration: req.body.duration || 0
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
            name: req.body.name || req.params.name,
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
    getSetting,
    getOrder
}