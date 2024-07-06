const JobModel = require('../models/job-model.js')
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { conferenceData, insertToList } = require('../temp/index');

class JobController {
    getAllJobs = asyncHandler(async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const size = parseInt(req.query.size) || 10;
            const offset = (page - 1) * size;

            const totalJobs = await JobModel.countDocuments({}).exec();
            const jobs = await JobModel.find({})
                .sort({ updatedAt: -1 })
                .skip(offset)
                .limit(size)
                .exec();

            return res.status(status.OK).json({
                maxRecords: totalJobs,
                maxPages: Math.ceil(totalJobs / size),
                size: size,
                currentPage: page,
                count: jobs.length,
                data: jobs
            });
        } catch (error) {
            next(error);
        }
    });

    getJobById = asyncHandler(async (req, res, next) => {
        try {

            const id = req.params?.id
            const job = await JobModel.findById(id).exec();

            return res.status(status.OK).json({
                job
            });
        } catch (error) {
            next(error);
        }
    });

    deleteJobById = asyncHandler(async (req, res, next) => {
        try {

            const id = req.params?.id
            await JobModel.findByIdAndDelete(id);

            return res.status(status.OK).json({
                message: "Job is deleted."
            });
        } catch (error) {
            next(error);
        }
    });

    deletePendingJob = asyncHandler(async (req, res, next) => {
        try {
            const count = await JobModel.deleteMany({ status: "pending" });

            return res.status(status.OK).json({
                message: `${count.deletedCount} jobs is deleted.`
            });
        } catch (error) {
            next(error);
        }
    });
}


module.exports = JobController;