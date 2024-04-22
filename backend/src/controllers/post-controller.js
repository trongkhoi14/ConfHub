const sequelize = require('../config/database');
const { status } = require('../constants/index.js');
const model = require('../models/index.js');
const asyncHandler = require('express-async-handler');
const queries = require('../utils/cfp-queries.js');
const inputs = require('../utils/input-handler.js');
const { QueryInterface } = require('sequelize');
require('dotenv').config();

class postController {
    // [GET] /api/v1/post
    getAllPosts = asyncHandler(async (req, res, next) => {
        try {
            let params = {
                userID: req.user._id,
                page: parseInt(req.query.page) || parseInt(process.env.DEFAULT_PAGE),
                size: parseInt(req.query.size) || process.env.DEFAULT_SIZE,
                offset: parseInt(process.env.DEFAULT_OFFSET)
            };
            const filterConditions = inputs.makeFilterConditions(params);
            const postedConferenceIDs = await model.postModel.findAll({
                attributes: ['CallForPaperCfpId'],
                where: { UserId: params.userID },
                limit: filterConditions.size,
                offset: filterConditions.offset
            });

            const postedConferences = await Promise.all(postedConferenceIDs.map(async (id) => {
                return await queries.selectConferenceByID(id.CallForPaperCfpId)
            }));

            return res.status(status.OK).json({
                quantity: postedConferences.length,
                data: postedConferences,
            });
        } catch (err) {
            next(err);
        }
    });

    // [POST] /api/v1/post
    addPost = asyncHandler(async (req, res, next) => {
        try {
            const { _id } = req.user;
            const user = await model.userModel.findByPk(_id, { attributes: ['id', 'role', 'license'] });
            if (user.role === "user" && user.license === false) {
                return res.status(status.UN_AUTHORIZED).json({
                    message: "You do not have permission."
                });
            };

            const conference = inputs.makeConferenceObject(req.body);

            if (inputs.containsEmptyValue(conference)) {
                return res.status(status.BAD_REQUEST).json({
                    status: false,
                    data: "Missing information."
                });
            };

            await queries.insertConference(conference, user);

            return res.status(status.OK).json({
                message: "Add new post successfully."
            });

        } catch (err) {
            next(err);
        }
    });

    updatePost = asyncHandler(async (req, res, next) => {
        try {
            const { _id } = req.user;
            const conferenceID = req.params?.id;

            const user = await model.userModel.findByPk(_id, { attributes: ['id', 'role', 'license'] });
            if (user.role === "user" && user.license === false) {
                return res.status(status.UN_AUTHORIZED).json({
                    message: "You do not have permission."
                });
            };

            const post = await model.postModel.findOne({ where: { UserId: _id, CallForPaperCfpId: conferenceID } });
            if (!post) {
                return res.status(status.NOT_FOUND).json({
                    message: "This post is not existed."
                });
            };

            const conference = inputs.makeConferenceObject(req.body);
            if (inputs.containsEmptyValue(conference)) {
                return res.status(status.BAD_REQUEST).json({
                    status: false,
                    data: "Missing information."
                });
            };

            await queries.updateConference(conferenceID, conference);
            return res.status(status.OK).json({
                message: "Update post successfully."
            });

        } catch (err) {
            next(err);
        }
    });

    deletePost = asyncHandler(async (req, res, next) => {
        try {
            const { _id } = req.user;
            const conferenceID = req.params?.id;
            const user = await model.userModel.findByPk(_id);
            const post = await model.postModel.findOne({ where: { UserId: _id, CallForPaperCfpId: conferenceID } });

            if (!user) {
                return res.status(status.UN_AUTHORIZED).json({
                    message: "You do not have permission."
                });
            };

            if (!post) {
                return res.status(status.NOT_FOUND).json({
                    message: "This post is not existed."
                });
            };

            await queries.deleteConferenceByID(conferenceID);
            return res.status(status.OK).json({
                message: "Delete post successfully."
            });

        } catch (err) {
            next(err);
        }
    });
}

module.exports = postController;