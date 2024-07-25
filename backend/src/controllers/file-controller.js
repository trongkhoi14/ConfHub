const ConferenceModel = require('../models/mongodb-conference');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
const { addCrawlJob } = require('../utils/crawl-job.js');
const mongoose = require('mongoose');
const { dataPineline } = require('../utils/copy-of-datapineline.js');
const { conferenceData, insertToList } = require('../temp/index');
const { insertCallForPaper, selectCallForPaperForFilter } = require('../utils/cfp-queries.js');

class FileController {
    insert = asyncHandler(async (req, res, next) => {
        try {
            const existingConferences = await ConferenceModel.find({ Title: req.body.title, Acronym: req.body.acronym });
            if (existingConferences.length > 0 && !existingConferences.some(item => item.Source == req.body.source)) {

                // 1. mongo obj
                const newConference = new ConferenceModel(existingConferences[0].toObject());
                newConference._id = new mongoose.Types.ObjectId();
                newConference.Source = req.body.source;
                newConference.Rank = req.body.rank;
                newConference.PrimaryFoR = req.body.PrimaryFoR
                await newConference.save();

                // 2. crawl job
                const jobID = await addCrawlJob(newConference._id.toString(), "import conference");

                // 3. pg

                const conferenceObj = await dataPineline(newConference);
                if (conferenceObj) {
                    const pgInstance = await insertCallForPaper(conferenceObj);

                    // 4. view
                    await insertToList(pgInstance.cfp_id, conferenceData.listOfConferences);

                    return res.status(status.OK).json({
                        message: "mode 1",
                        newMongoInstance: true,
                        crawlJob: jobID,
                        newPgInstance: true,
                        cfp_id: pgInstance.cfp_id
                    });
                }

                return res.status(status.INTERNAL_ERROR).json({
                    message: "Error in mode 1."
                });

            } else if (existingConferences.length > 0) {
                const existingConference = existingConferences.find(item => item.Source == req.body.source);
                // 2. crawl job
                const jobID = await addCrawlJob(existingConference._id.toString(), "import conference");

                // 3. pg
                const isExistedPgInstance = conferenceData.listOfConferences.some(item =>
                    item.information.name == existingConference.Title &&
                    item.information.acronym == existingConference.Acronym &&
                    item.information.source == existingConference.Source
                );

                if (isExistedPgInstance) {
                    return res.status(status.OK).json({
                        message: "mode 2.0",
                        newMongoInstance: false,
                        crawlJob: jobID,
                        newPgInstance: false,
                        cfp_id: isExistedPgInstance.cfp_id
                    });
                }

                const conferenceObj = await dataPineline(existingConference);
                if (conferenceObj) {
                    const pgInstance = await insertCallForPaper(conferenceObj);

                    // 4. view
                    await insertToList(pgInstance.cfp_id, conferenceData.listOfConferences);

                    return res.status(status.OK).json({
                        message: "mode 2",
                        newMongoInstance: false,
                        crawlJob: jobID,
                        newPgInstance: true,
                        cfp_id: pgInstance.cfp_id
                    });
                }

                return res.status(status.INTERNAL_ERROR).json({
                    message: "Error in mode 2."
                });

            } else if (existingConferences.length == 0) {

                // 1. mongo obj
                const newConference = await ConferenceModel.create({
                    Title: req.body.title,
                    Acronym: req.body.acronym,
                    Source: req.body.source,
                    Rank: req.body.rank,
                    PrimaryFoR: req.body.PrimaryFoR,
                    Links: [],
                    ConferenceDate: [],
                    SubmissonDate: [],
                    NotificationDate: [],
                    CameraReady: [],
                    CallForPaper: null,
                    Location: null,
                    Type: null
                });

                // 2. crawl job
                const jobID = await addCrawlJob(newConference._id.toString(), "import conference");

                // 3. pg
                const conferenceObj = await dataPineline(newConference);
                if (conferenceObj) {
                    const pgInstance = await insertCallForPaper(conferenceObj);

                    // 4. view
                    await insertToList(pgInstance.cfp_id, conferenceData.listOfConferences);

                    return res.status(status.OK).json({
                        message: "mode 3",
                        newMongoInstance: true,
                        crawlJob: jobID,
                        newPgInstance: true,
                        cfp_id: pgInstance.cfp_id
                    });
                }

                return res.status(status.INTERNAL_ERROR).json({
                    message: "Error in mode 3."
                });
            }

            return res.status(status.OK).json({
                message: "Nothing happen!"
            });

        } catch (err) {
            next(err);
        }
    });
}

module.exports = FileController;