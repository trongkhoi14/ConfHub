const ConferenceModel = require('../models/mongodb-conference');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
const { addCrawlJob } = require('../utils/crawl-job.js');
const mongoose = require('mongoose');

class FileController {
    insert = asyncHandler(async (req, res, next) => {
        try {
            const existingConference = await ConferenceModel.findOne({ Title: req.body.title, Acronym: req.body.acronym });

            if (existingConference && existingConference.Source != req.body.source) {
                const newConference = new ConferenceModel(existingConference.toObject());
                newConference._id = new mongoose.Types.ObjectId();
                newConference.Source = req.body.source;
                newConference.Rank = req.body.rank;
                newConference.PrimaryFoR = req.body.PrimaryFoR
                await newConference.save();

                return res.status(status.OK).json({
                    newConference
                });

            } else if (!existingConference) {
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

                await addCrawlJob(newConference._id.toString());

                return res.status(status.OK).json({
                    newConference
                });
            }

            return res.status(status.OK).json({
                message: "This conference is existed."
            });

        } catch (err) {
            next(err);
        }
    });
}

module.exports = FileController;