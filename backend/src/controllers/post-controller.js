const { Op } = require('sequelize');
const sequelize = require('../config/database')
const { status } = require('../constants/index.js');
const model = require('../models/index.js');
const moment = require('moment');
const asyncHandler = require('express-async-handler');

class postController {
    // [GET] /api/v1/follow
    getAllPosts = asyncHandler(async (req, res, next) => {
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
        const { _id } = req.user
        if (_id) {
            const user = await model.userModel.findByPk(_id, { attributes: ['address'] });
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
                    model: model.postModel,
                    where: {
                        UserId: _id || { [Op.ne]: null }
                    }
                },
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
                data: data,
            })
        } catch (err) {
            next(err);
        }
    });

    // [POST] /api/v1/follow
    addPost = asyncHandler(async (req, res, next) => {
        try {
            const { _id } = req.user;
            // check permission
            const user = await model.userModel.findByPk(_id, { attributes: ['role', 'license'] });
            if (user.role === "user" && user.license === false) {
                return res.status(status.UN_AUTHORIZED).json({
                    message: "You do not have permission."
                })
            }

            // input condition
            function containsEmptyValue(x) {
                if (Array.isArray(x)) {
                    return x.some(item => containsEmptyValue(item));
                } else if (typeof (x) === 'object' && x !== null) {
                    return Object.values(x).some(value => isEmpty(value));
                } else {
                    return isEmpty(x);
                }
            }
            function isEmpty(value) {
                return value === null || value === undefined || value === "" || value === false;
            }
            const { conf_name, acronym, content, link, rating, rank,
                source_name, fieldOfResearch, organization, important_date } = req.body
            if (!conf_name || !acronym || !content || !link 
                || containsEmptyValue(fieldOfResearch)
                || containsEmptyValue(organization) 
                || containsEmptyValue(important_date)) {
                return res.status(status.BAD_REQUEST).json({
                    status: false,
                    data: "Missing information."
                })
            }

            // add transaction
            const result = await sequelize.transaction(async (t) => {
                const [source] = await model.sourceModel.findOrCreate({
                    where: { src_name: source_name !== "" ? source_name : "N/I"},
                    defaults: { src_name: source_name !== "" ? source_name : "N/I"},
                    transaction: t 
                });

                const [conference] = await model.conferenceModel.findOrCreate({
                    where: {
                        conf_name: conf_name,
                        acronym: acronym
                    },
                    defaults: {
                        conf_name: conf_name,
                        acronym: acronym
                    },
                    transaction: t 
                });
                
                let forArr = []
                for (const element of fieldOfResearch) {
                    const result = await model.fieldOfResearchModel.findOne({ where: { for_name: element.for_name }});
                    if (!result) {
                        forArr.push(element);
                    }
                }

                const fors = await model.fieldOfResearchModel.bulkCreate(forArr, {
                    ignoreDuplicates: true,
                    transaction: t
                });

                const cfp = await model.callForPaperModel.create({
                    content: content,
                    link: link,
                    rating: rating ? rating : 5,
                    rank: rank,
                    ConferenceConfId: conference.conf_id,
                    SourceSrcId: source.src_id
                }, { transaction: t })

                if(cfp !== null) {
                    const org = await model.organizationModel.create({
                        type: organization.type,
                        location: organization.location,
                        conf_date: organization.conf_date,
                        CallForPaperCfpId: cfp.cfp_id
                    }, { transaction: t })
                    
                    const dateArr = important_date.map(element => {
                        return {
                            date_type: element.date_type,
                            date_value: element.date_value,
                            CallForPaperCfpId: cfp.cfp_id
                        }
                    })
                    await model.importantDateModel.bulkCreate(dateArr, { transaction: t })
                    
                    if (fors !== null) {
                        const cfpForArr = fors.map(element => {
                            return {
                                CallForPaperCfpId: cfp.cfp_id,
                                FieldOfResearchForId: element.for_id
                            }
                        })
                        await model.cfpForModel.bulkCreate(cfpForArr, { transaction: t })
                    }

                    await model.postModel.create({
                        post_time: new Date(),
                        UserId: _id,
                        CallForPaperCfpId: cfp.cfp_id
                    }, { transaction: t })
                }
            });

            return res.status(status.OK).json({
                message: "Add new post successfully."
            })

        } catch (err) {
            next(err);
        }
    })
}

module.exports = postController;