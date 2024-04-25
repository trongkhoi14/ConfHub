const model = require('../models/index.js');
const query = require('../utils/queries.js');
const { status } = require('../constants/index.js');
const input = require('../utils/input-handler.js');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

class followController {
    // [GET] /api/v1/follow
    getFollowedConferences = asyncHandler(async (req, res, next) => {
        try {
            const filterConditions = await input.getFilterConditions(req);
            const followedConferenceIDs = await model.followModel.findAll({
                attributes: ['CallForPaperCfpId'],
                where: { UserId: filterConditions.userID },
                limit: filterConditions.size,
                offset: filterConditions.offset
            });
            const followedConferences = await Promise.all(followedConferenceIDs.map(async (id) => {
                return await query.CallForPaperQuery.selectCallForPaper(id.CallForPaperCfpId)
            }));
            return res.status(status.OK).json({
                quantity: followedConferences.length,
                data: followedConferences
            });
        } catch (err) {
            next(err);
        }
    });

    // [POST] /api/v1/follow
    follow = asyncHandler(async (req, res, next) => {
        try {
            let params = {
                userID: req.user._id,
                cfp_id: req.body.cfp_id
            };
            const [follow, created] = await model.followModel.findOrCreate({
                where: { UserId: params.userID, CallForPaperCfpId: params.cfp_id }
            });
            return res.status(status.OK).json({
                message: created ? "Followed!" : "Nothing happened.",
            });
        } catch (err) {
            next(err);
        }
    });

    // [DELETE] /api/v1/follow
    unfollow = asyncHandler(async (req, res, next) => {
        try {
            let params = {
                userID: req.user._id,
                cfp_id: req.body.cfp_id
            };
            await model.followModel.destroy({
                where: { UserId: params.userID, CallForPaperCfpId: params.cfp_id }
            });
            return res.status(status.OK).json({
                message: "Unfollowed!",
            });
        } catch (err) {
            next(err);
        }
    })
}

module.exports = followController;