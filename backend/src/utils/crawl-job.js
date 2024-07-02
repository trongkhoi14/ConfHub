const JobModel = require('../models/job-model');

const addCrawlJob = async (conf_id, type) => {
    const existingJob = await JobModel.findOne({ conf_id: conf_id, status: 'pending', type: type });
    if (existingJob) {
        return existingJob._id;
    }
    const job = new JobModel({ status: 'pending', conf_id: conf_id, type: type });
    await job.save();
    return job._id;
};

module.exports = {
    addCrawlJob
}