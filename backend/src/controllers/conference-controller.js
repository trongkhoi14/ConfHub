const { Console } = require('winston/lib/winston/transports');
const { status } = require('./../constants');
const model = require('./../models');
const conferenceModel = require('../models/conference-model');

class ConferenceController {
    // [GET] /api/v1/conference/
    getAllConference = async (req, res, next) => {
        // pagination const
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 5;
        const search = req.query.search || "";
        const minDate = new Date("1600-01-01T00:00:00.000Z");
        const maxDate = new Date("2100-01-30T00:00:00.000Z");
        const locations = await conferenceModel.distinct("location");
        const ranks = await conferenceModel.distinct("rank");
        const fors = await conferenceModel.distinct("fieldOfResearch");
        const sources = await conferenceModel.distinct("source");
        const acronyms = await conferenceModel.distinct("acronym");
        const types = await conferenceModel.distinct("type");
        const categories = await conferenceModel.distinct("category");

        // holding date
        let startDate = minDate;
        let endDate = maxDate;
        if (req.query.startDate) {
            startDate = new Date(req.query.startDate);
            if (isNaN(startDate.getTime())) {
                startDate = minDate;
            }
        }
        if (req.query.endDate) {
            endDate = new Date(req.query.endDate);
            if (isNaN(endDate.getTime())) {
                endDate = maxDate;
            }
        }

        // submission date
        let startSubDate = minDate;
        let endSubDate = maxDate;
        if (req.query.startSubDate) {
            startSubDate = new Date(req.query.startSubDate);
            if (isNaN(startSubDate.getTime())) {
                startSubDate = minDate;
            }
        }
        if (req.query.endSubDate) {
            endSubDate = new Date(req.query.endSubDate);
            if (isNaN(endSubDate.getTime())) {
                endSubDate = maxDate;
            }
        }

        // location
        let location = req.query.location || "all";
        if (location === "all") {
            location = [...locations]
        } else {
            let arr = []
            arr.unshift(req.query.location)
            location = arr
        }

        // rank
        let rank = req.query.rank || "all";
        if (rank === "all") {
            rank = [...ranks]
        } else {
            let arr = []
            arr.unshift(req.query.rank)
            rank = arr
        }

        // field of research
        let fieldOfResearch = req.query.for || ["all"];
        if (fieldOfResearch[0] === "all") {
            fieldOfResearch = [...fors]
        }

        // source
        let source = req.query.source || ["all"];
        if (source[0] === "all") {
            source = [...sources]
        }

        // category
        let category = req.query.category || "all";
        if (category === "all") {
            category = [...categories]
        } else {
            let arr = []
            arr.unshift(req.query.category)
            category = arr
        }

        // acronym
        let acronym = req.query.acronym || ["all"];
        if (acronym[0] === "all") {
            acronym = [...acronyms]
        }

        // rating
        let rating = parseFloat(req.query.rating) || 0;

        // impact factor
        let impactFactor = parseFloat(req.query.impactFactor) || 0;

        // holding type
        let type = req.query.type || "all";
        if (type === "all") {
            type = [...types]
        } else {
            let arr = []
            arr.unshift(req.query.type)
            type = arr
        }

        // sort (!) but only one field
        let sort = req.query.sort || "rank";
        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
        let sortBy = {}
        if (sort[1]) {
            sortBy[sort[0]] = sort[1];
        } else {
            sortBy[sort[0]] = "asc";
        }

        // query
        const conferences = await conferenceModel.find({
            type: { $in: [...type] },
            name: { $regex: search, $options: "i" },
            date: {
                $gte: startDate,
                $lt: endDate
            },
            document: {
                $elemMatch: {
                    submissionDate: {
                        $gte: startSubDate,
                        $lt: endSubDate
                    }
                }
            },
            rank: { $in: [...rank] },
            fieldOfResearch: { $in: [...fieldOfResearch] },
            location: { $in: [...location] },
            source: { $in: [...source] },
            acronym: { $in: [...acronym] },
            'rating.avgRating': { $gte: rating },
            impactFactor: { $gte: impactFactor },
            category: { $in: [...category] }
        })
            .sort(sortBy)
            .skip((page - 1) * size)
            .limit(size)

        const count = await conferenceModel.countDocuments({
            type: { $in: [...type] },
            name: { $regex: search, $options: "i" },
            date: {
                $gte: startDate,
                $lt: endDate
            },
            document: {
                $elemMatch: {
                    submissionDate: {
                        $gte: startSubDate,
                        $lt: endSubDate
                    }
                }
            },
            rank: { $in: [...rank] },
            fieldOfResearch: { $in: [...fieldOfResearch] },
            location: { $in: [...location] },
            source: { $in: [...source] },
            acronym: { $in: [...acronym] },
            'rating.avgRating': { $gte: rating },
            impactFactor: { $gte: impactFactor },
            category: { $in: [...category] }
        })

        try {
            res.status(status.OK).json({
                amount: count,
                maxPage: Math.ceil(count / size),
                locations,
                ranks,
                fors,
                sources,
                acronyms,
                types,
                conferences
            })
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/v1/conference?id
    getConference = async (req, res, next) => {
        const id = req.params?.id;
        const conference = await conferenceModel.find({ _id: id });
        try {
            res.status(status.OK).json({
                conference,
            })
        } catch(err) {
            next(err);
        }
    }
}

module.exports = ConferenceController;