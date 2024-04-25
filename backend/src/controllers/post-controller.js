const model = require('../models/index.js');
const input = require('../utils/input-handler.js');
const query = require('../utils/queries.js');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
const queries = require('../utils/queries.js');
require('dotenv').config();

class postController {
    // [GET] /api/v1/post
    getAllPosts = asyncHandler(async (req, res, next) => {
        try {
            const filterConditions = await input.getFilterConditions(req);
            const postedConferences = await query.PostQuery.selectAllPosts(filterConditions);

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

            let params = req.body;
            params.owner = user.role;
            const conference = inputs.makeConferenceObject(params);

            if (inputs.containsEmptyValue(conference, ['cfp_id', 'organizations', 'importantDates'])) {
                return res.status(status.BAD_REQUEST).json({
                    status: false,
                    data: "Missing information."
                });
            };

            await query.PostQuery.insertPost(conference, user);

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
            let params = req.body;
            params.id = req.params?.id;

            const user = await model.userModel.findByPk(_id, { attributes: ['id', 'role', 'license'] });
            if (user.role === "user" && user.license === false) {
                return res.status(status.UN_AUTHORIZED).json({
                    message: "You do not have permission."
                });
            };

            const post = await model.postModel.findOne({ where: { UserId: _id, CallForPaperCfpId: params.id } });
            if (!post) {
                return res.status(status.NOT_FOUND).json({
                    message: "This post is not existed."
                });
            };

            const conference = inputs.makeConferenceObject(params);
            if (inputs.containsEmptyValue(conference, ['cfp_id', 'name', 'acronym', 'owner', 'organizations', 'importantDates'])) {
                return res.status(status.BAD_REQUEST).json({
                    status: false,
                    data: "Missing information."
                });
            };

            await query.PostQuery.updatePost(conference);

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

            await queries.PostQuery.deletePost(conferenceID);

            return res.status(status.OK).json({
                message: "Delete post successfully."
            });

        } catch (err) {
            next(err);
        }
    });
}

module.exports = postController;