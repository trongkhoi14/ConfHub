const model = require('../models/index.js');
const query = require('../utils/queries.js');
const input = require('../utils/input-handler.js');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
const { conferenceData, updateToList } = require('../temp/index.js');
const { addCrawlJob } = require('../utils/crawl-job.js');
const { socketJob } = require('../config/socket');
require('dotenv').config();

class ConferenceCFPController {
    // [GET] /api/v1/conference/
    getAllConferences = asyncHandler(async (req, res, next) => {
        try {

            // const order = await input.getOrder(req);

            const filterConditions = await input.getFilterConditions(req);

            const conferences = await query.CallForPaperQuery.selectAllCallForPapers(filterConditions);
            return res.status(status.OK).json({
                maxRecords: conferences.maxRecords,
                maxPages: conferences.maxPages,
                size: conferences.size,
                currentPage: conferences.currentPage,
                count: conferences.count,
                data: conferences.data
            });

        } catch (err) {
            next(err);
        }
    });

    // [GET] /api/v1/conference?id
    getConferenceDetail = asyncHandler(async (req, res, next) => {
        try {
            const conferenceID = req.params?.id;
            const userID = req.user?._id;

            const toCheckConference = conferenceData.inactiveConferences.find(item => item.CallForPaperCfpId == conferenceID);

            if (toCheckConference) {
                if (userID) {
                    const user = await model.userModel.findOne({
                        where: {
                            id: userID,
                            role: "admin"
                        }
                    });

                    if (user || toCheckConference.UserId == userID) {
                        const data = await query.CallForPaperQuery.selectCallForPaper(conferenceID);
                        return res.status(status.OK).json({
                            data: data
                        });

                    } else {

                        return res.status(status.BAD_REQUEST).json({
                            data: []
                        });
                    }

                } else {
                    return res.status(status.BAD_REQUEST).json({
                        data: []
                    });
                }

            } else {
                const data = await query.CallForPaperQuery.selectCallForPaper(conferenceID);
                return res.status(status.OK).json({
                    data: data
                });
            }

        } catch (err) {
            next(err);
        }
    });

    updateNow = asyncHandler(async (req, res, next) => {
        try {
            const conferenceID = req.params?.id;
            const socketID = req.body?.socketID;

            const conference = conferenceData.listOfConferences.filter(item => item.id == conferenceID);
            if (conference.length === 0) {
                return res.status(status.NOT_FOUND).json({
                    message: "Can not find this call for paper!"
                });
            }

            const nkey = conference[0].information.nkey;
            if (!nkey) {
                return res.status(status.BAD_REQUEST).json({
                    message: "We don't have permission to update this conference!"
                });
            }

            const jobID = await addCrawlJob(nkey, "update now");
            socketJob.push({
                _socketID: socketID,
                _jobID: jobID.toString(),
                _cfpID: conferenceID
            });

            return res.status(status.OK).json({
                message: 'This page will be updated soon. Please waiting for next notification.'
            });

        } catch (err) {
            next(err);
        }
    });

    deleteCallForPaper = asyncHandler(async (req, res, next) => {
        try {
            const conferenceID = req.params?.id;

            await query.PostQuery.deletePost(conferenceID);

            return res.status(status.OK).json({
                message: "Delete this call for paper successfully."
            });

        } catch (err) {
            next(err);
        }
    });

    selectTopView = asyncHandler(async (req, res, next) => {
        try {
            const amount = req.query.amount || 10;
            const arr = conferenceData.listOfConferences.filter(item => item.information.status == true);
            const topViewArr = query.CallForPaperQuery.findTopView(arr, amount);

            return res.status(status.OK).json({
                topViewArr
            });

        } catch (err) {
            next(err);
        }
    });
};

module.exports = ConferenceCFPController;