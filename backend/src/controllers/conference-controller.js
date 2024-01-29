const { Console } = require('winston/lib/winston/transports');
const {status} = require('./../constants');
const model = require('./../models');
const conferenceModel = require('../models/conference-model');

class ConferenceController {
    // [GET] /api/v1/conference/
    getAllConference = async (req, res, next) => {
        // pagination const
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 5;
        const search = req.query.search || "";

        // holding date
        const minDate = new Date("1600-01-01T00:00:00.000Z");
        const maxDate = new Date("2100-01-30T00:00:00.000Z");
        let sort = req.query.sort || "rank";
        let type = req.query.type || "all";
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

        // holding type
        const typeOptions = ["online", "offline"]
        type === "all"?(type = [...typeOptions]):(type = req.query.type.split(","));
        
        // sort but only one field
        req.query.sort?(sort = req.query.sort.split(",")):(sort = [sort]);
        let sortBy = {}
        if (sort[1]){
            sortBy[sort[0]] = sort[1];
        } else {
            sortBy[sort[0]] = "asc";
        }
        
        // query
        const conferences = await conferenceModel.find({
            type: {$in: [...type]},
            name: {$regex: search, $options: "i"},
            date: {
                $gte: startDate,
                $lt: endDate
            },
        })
            .sort(sortBy)
            .skip((page-1) * size)
            .limit(size)
        
        const count = await conferenceModel.countDocuments({
            type: {$in: [...type]},
            name: {$regex: search, $options: "i"},
            date: {
                $gte: startDate,
                $lt: endDate
            },
        })

        try {
            res.status(status.OK).json({
                amount: count,
                conferences
            })
        } catch(err) {
            next(err);
        }
    }
}

module.exports = ConferenceController;