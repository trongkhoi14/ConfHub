const { Op } = require('sequelize');
const { status } = require('../constants/index.js');
const model = require('../models/index.js');
const moment = require('moment');
const asyncHandler = require('express-async-handler');

class ConferenceCFPController {
    // // [GET] /api/v1/conference/
    getAllConferences = asyncHandler(async (req, res, next) => {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || null;
        const offset = (page - 1) * size || 0;

        // Search by name
        const search = req.query.search || "";

        // Submission date range
        let subStart = req.query.subStart || null;
        let subEnd = req.query.subEnd || null;
        let date_type = "sub";
        if (subStart === null && subEnd !== null) {
            subStart = '1800-01-01';
        } else if (subStart !== null && subEnd === null) {
            subEnd = '2100-01-01';
        } else if (subStart === null && subEnd === null) {
            date_type = "all";
            subStart = '1800-01-01';
            subEnd = '2100-01-01';
        }

        // Organization
        const type = req.query.type || "all";
        const confStart = req.query.confStart || '1800-01-01';
        const confEnd = req.query.confEnd || '2100-01-01';
        let location = req.query.location || "all";

        // check if location is domestic
        const uid = req.body.id
        if (uid) {
            const user = await model.userModel.findByPk(uid, { attributes: ['address'] });
            if (location === "domestic") {
                const address = (user.address !== null ? user.address : "all");
                location = address.split(",").pop().trim();
            }
        }

        // Conferences
        const acronym = req.query.acronym || "all";

        // Call for papers
        const source = req.query.source || "all";
        const rating = parseFloat(req.query.rating) || 0;
        const rank = req.query.rank || "all";
        const fieldOfResearch = req.query.for || "all";

        // query
        const results = await model.callForPaperModel.findAll({
            where: {
                status: "valid",
                rating: { [Op.gte]: rating },
                rank: rank !== "all" ? rank : { [Op.ne]: null },
            },
            include: [
                {
                    model: model.sourceModel,
                    where: {
                        src_name: source !== "all" ? source : { [Op.ne]: null }
                    },
                },
                {
                    model: model.conferenceModel,
                    where: {
                        conf_name: { [Op.iLike]: `%${search}%` },
                        acronym: acronym !== "all" ? acronym : { [Op.ne]: null },
                    }
                },
                {
                    model: model.importantDateModel,
                    where: {
                        date_type: date_type !== "all" ? date_type : { [Op.ne]: null },
                        date_value: { [Op.between]: [moment(subStart).toDate(), moment(subEnd).toDate()] }
                    }
                },
                {
                    model: model.organizationModel,
                    where: {
                        type: type !== "all" ? type : { [Op.ne]: null },
                        location: location !== "all" ? { [Op.iLike]: `%${location}%` } : { [Op.ne]: null },
                        conf_date: { [Op.between]: [moment(confStart).toDate(), moment(confEnd).toDate()] }
                    }
                },
                {
                    model: model.cfpForModel,
                    include: {
                        model: model.fieldOfResearchModel,
                        where: {
                            for_name: fieldOfResearch !== "all" ? fieldOfResearch : { [Op.ne]: null },
                        }
                    }
                }
            ],
            limit: size,
            offset: offset
        })

        const data = results.map(result => {
            const { ImportantDates, Organizations, CfpFors } = result.toJSON();

            const mappedImportantDates = ImportantDates.map(ImportantDate => ({
                date_type: ImportantDate.date_type,
                date_value: ImportantDate.date_value,
                keyword: ImportantDate.keyword,
                status: ImportantDate.date_status,
            }));

            const mappedOrganizations = Organizations.map(Organization => ({
                type: Organization.type,
                location: Organization.location,
                conf_date: Organization.conf_date,
                keyword: Organization.keyword,
            }));

            const mappedFors = CfpFors.map(CfpFor => ({
                for_name: CfpFor.FieldOfResearch.for_name
            }));

            return {
                cfp_id: result.cfp_id,
                name: result.Conference.conf_name,
                acronym: result.Conference.acronym,
                cfp_content: result.content,
                link: result.link,
                rating: result.rating,
                rank: result.rank,
                source: result.Source.src_name,
                importantDates: mappedImportantDates,
                organizations: mappedOrganizations,
                fieldOfResearch: mappedFors,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
            };
        })

        try {
            res.status(status.OK).json({
                quantity: data.length,
                // maxPage: Math.ceil(data.length / size),
                data: data,
            })
        } catch (err) {
            next(err);
        }
    });

    // [GET] /api/v1/conference?id
    getConferenceDetail = asyncHandler(async (req, res, next) => {
        const id = req.params?.id;
        const result = await model.callForPaperModel.findByPk(id, {
            attributes: ['content', 'link', 'rating', 'rank', 'createdAt', 'updatedAt'],
            include: [
                {
                    model: model.sourceModel,
                    attributes: ['src_name']
                },
                {
                    model: model.conferenceModel,
                    attributes: { exclude: ['conf_id'] }
                },
                {
                    model: model.importantDateModel,
                    attributes: { exclude: ['date_id', 'CallForPaperCfpId'] }
                },
                {
                    model: model.organizationModel,
                    attributes: { exclude: ['org_id', 'CallForPaperCfpId'] }
                },
                {
                    model: model.cfpForModel,
                    include: {
                        model: model.fieldOfResearchModel,
                        attributes: ['for_name']
                    }
                }
            ]
        });

        const data = {
            name: result.Conference.conf_name,
            acronym: result.Conference.acronym,
            cfp_content: result.content,
            link: result.link,
            rating: result.rating,
            rank: result.rank,
            source: result.Source.src_name,
            importantDates: result.ImportantDates,
            organizations: result.Organizations,
            fieldOfResearch: result.CfpFors.map(CfpFor => { return CfpFor.FieldOfResearch.for_name }),
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        }

        try {
            res.status(status.OK).json({
                data: data
            })
        } catch (err) {
            next(err);
        }
    });
}

module.exports = ConferenceCFPController;