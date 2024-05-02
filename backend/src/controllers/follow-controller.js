const model = require('../models/index.js');
const query = require('../utils/queries.js');
const { status } = require('../constants/index.js');
const input = require('../utils/input-handler.js');
const asyncHandler = require('express-async-handler');
const sequelize = require('../config/database.js');
require('dotenv').config();

class followController {
    // [GET] /api/v1/follow
    getFollowedConferences = asyncHandler(async (req, res, next) => {
        try {
            const filterConditions = await input.getFilterConditions(req);
            const followedConferenceIDs = await model.followModel.findAll({
                where: { UserId: filterConditions.userID },
                limit: filterConditions.size,
                offset: filterConditions.offset
            });
            const followedConferences = await Promise.all(followedConferenceIDs.map(async (id) => {
                const conference = await query.CallForPaperQuery.selectCallForPaper(id.CallForPaperCfpId);
                return {
                    followId: id.tid,
                    callForPaper: conference
                }
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
                where: { UserId: params.userID, CallForPaperCfpId: params.cfp_id },
            });

            let autoAddNoteSetting = {
                userID: req.user?._id,
                name: process.env.AUTO_ADD_EVENT_TO_SCHEDULE
            }

            const isEnable = await query.SettingQuery.isEnable(autoAddNoteSetting);

            if (isEnable && created) {
                const dates = await query.ImportantDatesQuery.selectConferenceDates(follow.CallForPaperCfpId, "new");
                const orgs = await query.OrganizationQuery.selectConferenceOrganizations(follow.CallForPaperCfpId, "new");

                await Promise.all(dates.map(async (date) => {
                    const note = {
                        UserId: params.userID,
                        ImportantDateDateId: date.date_id,
                        FollowTid: follow.tid,
                    }
                    await query.NoteQuery.insertNote(note)
                }));

                await Promise.all(orgs.map(async (org) => {
                    const note = {
                        UserId: params.userID,
                        OrganizationOrgId: org.org_id,
                        FollowTid: follow.tid,
                    }
                    await query.NoteQuery.insertNote(note)
                }));
            }

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

            const t = await sequelize.transaction();

            await model.followModel.destroy({
                where: { UserId: params.userID, CallForPaperCfpId: params.cfp_id },
                transaction: t
            });

            await t.commit();

            return res.status(status.OK).json({
                message: "Unfollowed!",
            });
        } catch (err) {
            next(err);
        }
    })
}

module.exports = followController;