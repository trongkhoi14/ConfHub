const mongoose = require('mongoose');
const JobModel = require('../models/job-model');
const { getIO, crawlJob, cfpJob } = require('../config/socket');
const { sendNotificationToUser } = require('../services/notification-services');
const { increaseETLLog } = require('../utils/dashboard.js');
const { conferenceData } = require('../temp/index.js');
require('dotenv').config();

const io = getIO();

function findByJobId(jobId, map) {
    for (const [jobID, id] of map.entries()) {
        if (jobID === jobId) {
            return id;
        }
    }
    return null;
}

function deleteByJobId(jobId, map) {
    for (const [jobID, id] of map.entries()) {
        if (jobID === jobId) {
            map.delete(jobID);
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
            increaseETLLog(change.updateDescription.updatedFields.duration)

            const jobID = change.documentKey._id.toString();
            const userID = findByJobId(jobID, crawlJob);
            const cfpID = findByJobId(jobID, cfpJob);
            const conference = conferenceData.listOfConferences.find(item => item.id == cfpID);

            const message = `"id": "${cfpID}", "name": "${conference.information.name}"`
            sendNotificationToUser(userID, message);

            deleteByJobId(jobID, crawlJob);
            deleteByJobId(jobID, cfpJob);
        });

        console.log('Server is listening for changes...');
    } catch (error) {
        console.error('Error on Server listening on change stream:', error);
    }
};

module.exports = { monitorChanges };


