const model = require('../models/index.js');
const query = require('../utils/queries.js');
const input = require('../utils/input-handler.js');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
const { conferenceData, updateToList } = require('../temp/index.js');
const { addCrawlJob } = require('../utils/crawl-job.js');
const { crawlJob, cfpJob } = require('../config/socket');
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
            // const userID = req.user?._id;

            // const toCheckConference = conferenceData.inactiveConferences.find(item => item.CallForPaperCfpId == conferenceID);
            // if (toCheckConference && toCheckConference.UserId != userID) {
            //     return res.status(status.BAD_REQUEST).json({
            //         data: []
            //     });
            // }

            const data = await query.CallForPaperQuery.selectCallForPaper(conferenceID);
            return res.status(status.OK).json({
                data: data
            });

        } catch (err) {
            next(err);
        }
    });

    updateNow = asyncHandler(async (req, res, next) => {
        try {
            const conferenceID = req.params?.id;
            const userID = req.user?._id
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

            const jobID = await addCrawlJob(nkey);
            crawlJob.set(jobID.toString(), userID);
            cfpJob.set(jobID.toString(), conferenceID);

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
};

module.exports = ConferenceCFPController;