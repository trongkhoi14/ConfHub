const model = require('../models/index.js');
const query = require('../utils/queries.js');
const { status } = require('../constants/index.js');
const input = require('../utils/input-handler.js');
const asyncHandler = require('express-async-handler');
const sequelize = require('../config/database.js');
const { conferenceData } = require('../temp/index.js');
require('dotenv').config();

class followController {
    // [GET] /api/v1/follow
    getFollowedConferences = asyncHandler(async (req, res, next) => {
        try {
            const filterConditions = await input.getFilterConditions(req);
            const followedConferenceIDs = await model.followModel.findAndCountAll({
                attributes: ['CallForPaperCfpId'],
                where: { UserId: filterConditions.userID },
                limit: filterConditions.size,
                offset: filterConditions.offset
            });

            // const followedConferences = await Promise.all(followedConferenceIDs.rows.map(async (id) => {
            //     const conference = await query.CallForPaperQuery.selectCallForPaperForFilter(id.CallForPaperCfpId);
            //     return {
            //         followId: id.tid,
            //         callForPaper: conference
            //     }
            // }));
            const setIds = new Set(followedConferenceIDs.rows.map(item => item.CallForPaperCfpId));
            const followedConferences = conferenceData.listOfConferences.filter(item => setIds.has(item.id));

            const maxRecords = followedConferenceIDs.count
            return res.status(status.OK).json({
                maxRecords: maxRecords,
                maxPages: Math.ceil(maxRecords / filterConditions.size),
                size: filterConditions.size,
                currentPage: filterConditions.page,
                count: followedConferences.length,
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
                // benchmark: true,
                // logging: console.log,
            });

            let autoAddNoteSetting = {
                userID: req.user?._id,
                name: process.env.AUTO_ADD_EVENT_TO_SCHEDULE
            }

            const isEnable = await query.SettingQuery.isEnable(autoAddNoteSetting);

            if (isEnable && created) {
                // const dates = await query.ImportantDatesQuery.selectConferenceDates(follow.CallForPaperCfpId, "new");
                // const orgs = await query.OrganizationQuery.selectConferenceOrganizations(follow.CallForPaperCfpId, "new");

                const index = conferenceData.listOfConferences.findIndex(item => String(item.id) === String(follow.CallForPaperCfpId));
                const orgs = conferenceData.listOfConferences[index].organizations.filter(item => String(item.status) === 'new');
                const dates = conferenceData.listOfConferences[index].importantDates.filter(item => String(item.status) === 'new');

                await Promise.all(dates.map(async (date) => {
                    const note = {
                        note: "default",
                        date_value: date.date_value,
                        UserId: params.userID,
                        ImportantDateDateId: date.date_id,
                        FollowTid: follow.tid,
                    }
                    await query.NoteQuery.insertNote(note)
                }));

                await Promise.all(orgs.map(async (org) => {
                    const note = {
                        note: "default",
                        date_value: [org.start_date, org.end_date].join(" to "),
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

            await model.followModel.destroy({
                where: { UserId: params.userID, CallForPaperCfpId: params.cfp_id },
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