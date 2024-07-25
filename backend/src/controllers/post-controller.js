const model = require('../models/index.js');
const input = require('../utils/input-handler.js');
const query = require('../utils/queries.js');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
const { conferenceData, updateToList } = require('../temp/index.js');
const { increaseETLLog } = require('../utils/dashboard.js');
const CallForPaper = require('../models/call-for-paper-model.js');
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

            const excludes = ['cfp_id', 'organizations', 'importantDates', 'nkey', 'status', 'rank']
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

            const excludes = ['cfp_id', 'callForPaper', 'organizations', 'importantDates', 'nkey', 'status', 'rank'];
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
                    increaseETLLog(conference.duration);
                    return res.status(status.OK).json({
                        message: "Add new post successfully."
                    });

                } else {
                    conference.cfp_id = isExisted.cfp_id;
                    await query.PostQuery.updatePost(conference);
                    increaseETLLog(conference.duration);
                    return res.status(status.OK).json({
                        message: "Update post successfully."
                    });
                }
            }

            await query.PostQuery.insertPost(conference);
            increaseETLLog(conference.duration);

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

            const excludes = ['cfp_id', 'name', 'acronym', 'owner', 'organizations', 'importantDates', 'nkey', 'status', 'rank'];
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

    // [PUT]
    activatePost = asyncHandler(async (req, res, next) => {
        try {
            const cfpID = req.params?.id;
            const cfp = await model.callForPaperModel.findByPk(cfpID);
            if (cfp) {
                await cfp.update({ status: 'true' });
                await updateToList(cfpID, conferenceData.listOfConferences);
                // remove from inactive list
                const index = conferenceData.inactiveConferences.findIndex(item => String(item.CallForPaperCfpId) === String(cfpID));
                if (index !== -1) {
                    conferenceData.inactiveConferences.splice(index, 1);
                }
            }

            return res.status(status.OK).json({
                message: cfp ? `Call for paper ${cfpID} is active.` : `Can not find this call for papers.`
            });

        } catch (err) {
            next(err);
        }
    });

    deactivatePost = asyncHandler(async (req, res, next) => {
        try {
            const cfpID = req.params?.id;
            const cfp = await model.callForPaperModel.findByPk(cfpID);
            if (cfp) {
                await cfp.update({ status: 'false' });
                await updateToList(cfpID, conferenceData.listOfConferences);
                // add to inactive list
                const post = await model.postModel.findOne({
                    attributes: ['UserId', 'CallForPaperCfpId'],
                    where: {
                        CallForPaperCfpId: cfpID
                    }
                });

                if (post) {
                    conferenceData.inactiveConferences.unshift(post)
                } else {
                    conferenceData.inactiveConferences.unshift({
                        UserId: req.user._id,
                        CallForPaperCfpId: cfpID
                    })
                }
            }

            return res.status(status.OK).json({
                message: cfp ? `Call for paper ${cfpID} is inactive.` : `Can not find this call for papers.`
            });

        } catch (err) {
            next(err);
        }
    });
}

module.exports = postController;
