const mongoose = require('mongoose');
const JobModel = require('../models/job-model');
const { getIO, socketJob } = require('../config/socket');
const { sendNotificationToUser } = require('../services/notification-services');
const { increaseETLLog } = require('../utils/dashboard.js');
const { conferenceData } = require('../temp/index.js');
require('dotenv').config();

const io = getIO();

const monitorChanges = async () => {
    try {
        await mongoose.connect(process.env.MONGO_STRING_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const changeStream = JobModel.watch();

        changeStream.on('change', async (change) => {
            // console.log('Server detected change:', change);
            try {
                const jobID = change.documentKey._id.toString();
                // admin will listen all change
                let job;
                let cfp;
                if (change.operationType != "delete") {
                    job = await JobModel.findById(jobID);
                    cfp = conferenceData.listOfConferences.find(item => item.nkey == job.conf_id)?.information;
                }

                const res = {
                    operationType: change.operationType,
                    jobID: jobID,
                    job: job,
                    cfp: cfp
                }
                io.emit('job', res);

                // user only listen to update change
                if (change.operationType == "update") {
                    const toInform = socketJob.filter(item => item._jobID == jobID);

                    if (toInform.length > 0) {
                        const cfpID = toInform[0]._cfpID;
                        const conference = conferenceData.listOfConferences.find(item => item.id == cfpID);

                        if (conference) {
                            const name = conference.information.name;
                            const status = change.updateDescription?.updatedFields?.status || 'updating';
                            const error = change.updateDescription?.updatedFields?.error || null;
                            const progress = JSON.stringify(change.updateDescription?.updatedFields?.progress) || null;

                            const message = JSON.parse(`{ "id": "${cfpID}", "name": "${name}", "status": "${status}", "progress": ${progress}, "error": "${error}" }`);

                            for (let i of toInform) {
                                io.to(i._socketID).emit('notification', message);
                            }

                            // stop listening to this job's change stream
                            if (status == "failed" || status == "completed") {
                                const duration = change.updateDescription?.updatedFields?.duration || 0;
                                if (duration) increaseETLLog(duration);

                                for (let i = socketJob.length - 1; i >= 0; i--) {
                                    if (socketJob[i]._jobID == jobID) {
                                        socketJob.splice(i, 1);
                                    }
                                }
                            }
                        }

                    }
                }


            } catch (error) {
                console.log(error);
            }

        });

        console.log('Server is listening for changes...');
    } catch (error) {
        console.error('Error on Server listening on change stream:', error);
    }
};

module.exports = { monitorChanges };


