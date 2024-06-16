const mongoose = require('mongoose');
const JobModel = require('../models/job-model');
const { getIO, crawlJob, users } = require('../config/socket');
const { sendNotificationToUser } = require('../services/notification-services');
const { increaseETLLog } = require('../utils/dashboard.js');
require('dotenv').config();

const io = getIO();

function findUserIdByJobId(jobId) {
    for (const [jobID, userID] of crawlJob.entries()) {
        if (jobID === jobId) {
            return userID;
        }
    }
    return null;
}

function deleteByJobId(jobId) {
    for (const [jobID, userID] of crawlJob.entries()) {
        if (jobID === jobId) {
            crawlJob.delete(jobID);
            return true;
        }
    }
    return false;
}

const monitorChanges = async () => {
    try {
        await mongoose.connect(process.env.MONGO_STRING_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const changeStream = JobModel.watch([{ $match: { 'operationType': 'update' } }]);

        changeStream.on('change', (change) => {
            console.log('Server detected change:', change);

            const jobID = change.documentKey._id.toString();
            const userID = findUserIdByJobId(jobID);
            const message = `The conference you want to "Update now" has been updated!`
            sendNotificationToUser(userID, message);
            deleteByJobId(jobID);
        });

        console.log('Server is listening for changes...');
    } catch (error) {
        console.error('Error on Server listening on change stream:', error);
    }
};

module.exports = { monitorChanges };


