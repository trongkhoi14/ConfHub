const query = require("../utils/queries.js");
const model = require('../models/index.js');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');

class FeedbackController {
    getAllFeedbacks = asyncHandler(async (req, res, next) => {
        try {
            const userID = req.user?._id;
            const cfpID = req.params?.id;

            const cfp = await model.callForPaperModel.findByPk(cfpID);
            if (!cfp) {
                throw new Error("This call for paper is not existed.");
            }

            const feedbacks = await model.feedbackModel.findAndCountAll({
                where: { CallForPaperCfpId: cfpID },
                include: {
                    model: model.userModel,
                    attributes: ['name', 'email', 'phone']
                }
            });

            return res.status(status.OK).json({
                message: "Get all feedbacks successfully.",
                data: feedbacks
            });

        } catch (err) {
            next(err);
        }
    });

    getFeedback = asyncHandler(async (req, res, next) => {
        try {
            const fbID = req.params?.id;
            const feedback = await model.feedbackModel.findOne({
                where: { tid: fbID },
                include: {
                    model: model.userModel,
                    attributes: ['name', 'email', 'phone']
                }
            });
            return res.status(status.OK).json({
                message: feedback ? "Get this feedback successfully." : "Something went wrong!",
                data: feedback
            });
        } catch (err) {
            next(err);
        }
    });

    addFeedback = asyncHandler(async (req, res, next) => {
        try {
            const cfpID = req.params?.id;
            const userID = req.user?._id;

            const cfp = await model.callForPaperModel.findByPk(cfpID);
            if (!cfp) {
                throw new Error("This call for paper is not existed.");
            }

            const user = await model.userModel.findByPk(userID);
            if (!user) {
                throw new Error("User is not existed.");
            }

            const newFeedback = await model.feedbackModel.create();
            newFeedback.content = req.body.content ? req.body.content : "";
            newFeedback.time = new Date();
            if (req.body.rating) {
                if (req.body.rating >= 0 && req.body.rating <= 5)
                    newFeedback.rating = req.body.rating;
                else throw new Error("Rating value is invalid.");
            }

            newFeedback.UserId = userID;
            newFeedback.CallForPaperCfpId = cfpID;
            newFeedback.save();

            return res.status(status.OK).json({
                message: "Add new feedback successfully.",
                data: newFeedback
            });

        } catch (err) {
            next(err);
        }
    });

    updateFeedback = asyncHandler(async (req, res, next) => {
        try {
            const fbID = req.params?.id;
            const userID = req.user?._id;

            const feedback = await model.feedbackModel.findOne({
                where: {
                    tid: fbID,
                    UserId: userID
                }
            });

            if (!feedback) {
                throw new Error("You don't have permission to change this feedback.")
            }

            feedback.content = req.body.content ? req.body.content : "";
            feedback.time = new Date();
            if (req.body.rating) {
                if (req.body.rating >= 0 || req.body.rating <= 5)
                    feedback.rating = req.body.rating;
                else throw new Error("Rating value is invalid.");
            }

            feedback.save();

            return res.status(status.OK).json({
                message: "Update feedback successfully.",
                data: feedback
            });

        } catch (err) {
            next(err);
        }
    });

    deleteFeedback = asyncHandler(async (req, res, next) => {
        try {
            const fbID = req.params?.id;
            const userID = req.user?._id;

            const feedback = await model.feedbackModel.findOne({
                where: {
                    tid: fbID,
                    UserId: userID
                }
            });

            if (!feedback) {
                throw new Error("You don't have permission to change this feedback.")
            }

            await feedback.destroy();
            return res.status(status.OK).json({
                message: "Delete feedback successfully.",
            });
        } catch (err) {
            next(err);
        }
    });
}

module.exports = FeedbackController;