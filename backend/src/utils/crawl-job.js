const JobModel = require('../models/job-model')

const addCrawlJob = async conf_id => {
    const existingJob = await JobModel.findOne({ conf_id: conf_id, status: 'pending' });
    if (existingJob) {
        return existingJob._id;
    }
    const job = new JobModel({ status: 'pending', conf_id });
    await job.save();
    return job._id;
};

module.exports = {
    addCrawlJob
}