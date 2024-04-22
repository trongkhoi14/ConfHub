const { status } = require('../constants/index.js');
const model = require('../models/index.js');
const asyncHandler = require('express-async-handler');
const queries = require('../utils/cfp-queries.js');
const { makeFilterConditions } = require('../utils/input-handler.js');
require('dotenv').config();

class ConferenceCFPController {
    // // [GET] /api/v1/conference/
    getAllConferences = asyncHandler(async (req, res, next) => {
        try {
            let params = {
                userID: req.body.id,
                page: parseInt(req.query.page) || parseInt(process.env.DEFAULT_PAGE),
                size: parseInt(req.query.size) || process.env.DEFAULT_SIZE,
                offset: parseInt(process.env.DEFAULT_OFFSET),
                search: req.query.search || process.env.DEFAULT_CONDITION_VALUE,
                date_type: process.env.DEFAULT_CONDITION_VALUE,
                subStart: req.query.subStart,
                subEnd: req.query.subEnd,
                type: req.query.type || process.env.DEFAULT_CONDITION_VALUE,
                confStart: req.query.confStart || process.env.MIN_DATE,
                confEnd: req.query.confEnd || process.env.MAX_DATE,
                location: req.query.location || process.env.DEFAULT_CONDITION_VALUE,
                acronym: req.query.acronym || process.env.DEFAULT_CONDITION_VALUE,
                source: req.query.source || process.env.DEFAULT_CONDITION_VALUE,
                rating: req.query.rating || process.env.DEFAULT_CONDITION_RATING,
                rank: req.query.rank || process.env.DEFAULT_CONDITION_VALUE,
                fieldOfResearch: req.query.for || process.env.DEFAULT_CONDITION_VALUE
            };

            if (params.userID) {
                const user = await model.userModel.findByPk(params.userID, { attributes: ['address'] });
                if (user && params.location.toLowerCase() === process.env.DEFAULT_ADDRESS_OPTION) {
                    const address = (user.address !== null ? user.address : process.env.DEFAULT_CONDITION_VALUE);
                    params.location = address.split(",").pop().trim();
                }
            };

            if (!params.subStart && params.subEnd) {
                params.date_type = "sub";
                params.subStart = process.env.MIN_DATE;
            } else if (params.subStart && !params.subEnd) {
                params.date_type = "sub";
                params.subEnd = process.env.MAX_DATE;
            } else if (!params.subStart && !params.subEnd) {
                params.subStart = process.env.MIN_DATE;
                params.subEnd = process.env.MAX_DATE;
            }

            const filterConditions = makeFilterConditions(params);
            const conferences = await queries.selectConferenceByCondition(filterConditions);

            return res.status(status.OK).json({
                quantity: conferences.length,
                data: conferences
            });

        } catch (err) {
            next(err);
        }
    });

    // [GET] /api/v1/conference?id
    getConferenceDetail = asyncHandler(async (req, res, next) => {
        try {
            const conferenceID = req.params?.id;
            const conferenceData = await queries.selectConferenceByID(conferenceID);
            return res.status(status.OK).json({
                data: conferenceData
            });

        } catch (err) {
            next(err);
        }
    });
};

module.exports = ConferenceCFPController;