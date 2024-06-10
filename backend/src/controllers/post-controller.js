const model = require('../models/index.js');
const input = require('../utils/input-handler.js');
const query = require('../utils/queries.js');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

class postController {
    // [GET] /api/v1/post
    getAllPosts = asyncHandler(async (req, res, next) => {
        try {
            const filterConditions = await input.getFilterConditions(req);
            const posts = await query.PostQuery.selectAllPosts(filterConditions);

            return res.status(status.OK).json({
                maxRecords: posts.maxRecords,
                maxPages: posts.maxPages,
                size: posts.size,
                currentPage: posts.currentPage,
                count: posts.count,
                data: posts.data
            });
        } catch (err) {
            next(err);
        }
    });

    // [POST] /api/v1/post
    addPost = asyncHandler(async (req, res, next) => {
        try {
            const userID = req.user._id;
            const user = await query.UserQuery.selectUser(userID);
            let conference = input.getConferenceObject(req);
            conference.userID = userID;
            conference.owner = user.role;
            conference.status = false;

            const excludes = ['cfp_id', 'organizations', 'importantDates', 'nkey', 'status']
            if (input.containsEmptyValue(conference, excludes)) {
                return res.status(status.BAD_REQUEST).json({
                    status: false,
                    data: "Missing information."
                });
            };

            await query.PostQuery.insertPost(conference);

            return res.status(status.OK).json({
                message: "Add new post successfully."
            });

        } catch (err) {
            next(err);
        }
    });

    etlPost = asyncHandler(async (req, res, next) => {
        try {
            let conference = input.getConferenceObject(req);
            conference.owner = "crawler";
            conference.status = true;

            const excludes = ['cfp_id', 'callForPaper', 'organizations', 'importantDates', 'nkey', 'status'];
            if (input.containsEmptyValue(conference, excludes)) {
                return res.status(status.BAD_REQUEST).json({
                    status: false,
                    data: "Missing information."
                });
            };

            if (conference.nkey) {
                const isExisted = await model.callForPaperModel.findOne({ where: { nkey: conference.nkey } });
                if (!isExisted) {
                    await query.PostQuery.insertPost(conference);
                    return res.status(status.OK).json({
                        message: "Add new post successfully."
                    });

                } else {
                    conference.cfp_id = isExisted.cfp_id;
                    await query.PostQuery.updatePost(conference);
                    return res.status(status.OK).json({
                        message: "Update post successfully."
                    });
                }
            }

            await query.PostQuery.insertPost(conference);
            return res.status(status.OK).json({
                message: "Add new post with no natural key successfully."
            });

        } catch (err) {
            next(err);
        }
    });

    updatePost = asyncHandler(async (req, res, next) => {
        try {
            const { _id } = req.user;
            const conferenceID = req.params?.id;
            const post = await model.postModel.findOne({ where: { UserId: _id, CallForPaperCfpId: conferenceID } });
            const conference = input.getConferenceObject(req);

            if (!post) {
                return res.status(status.NOT_FOUND).json({
                    message: "This post is not existed."
                });
            };

            const excludes = ['cfp_id', 'name', 'acronym', 'owner', 'organizations', 'importantDates', 'nkey', 'status'];
            if (input.containsEmptyValue(conference, excludes)) {
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
            const post = await model.postModel.findOne({ where: { UserId: _id, CallForPaperCfpId: conferenceID } });

            if (!post) {
                return res.status(status.NOT_FOUND).json({
                    message: "This post is not existed."
                });
            };

            await query.PostQuery.deletePost(conferenceID);

            return res.status(status.OK).json({
                message: "Delete post successfully."
            });

        } catch (err) {
            next(err);
        }
    });
}

module.exports = postController;
