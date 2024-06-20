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

        const changeStream = JobModel.watch([{ $match: { 'operationType': 'update' } }]);

        changeStream.on('change', (change) => {
            console.log('Server detected change:', change);
            try {
                const duration = change.updateDescription?.updatedFields?.duration || 0;
                if (duration) increaseETLLog(duration);

                const jobID = change.documentKey._id.toString();

                const toInform = socketJob.filter(item => item._jobID == jobID);

                if (toInform.length > 0) {
                    const cfpID = toInform[0]._cfpID;
                    const conference = conferenceData.listOfConferences.find(item => item.id == cfpID);

                    if (conference) {
                        const name = conference.information.name;
                        const message = JSON.parse(`{ "id": "${cfpID}", "name": "${name}" }`);

                        for (let i of toInform) {
                            io.to(i._socketID).emit('notification', message);
                        }

                        socketJob = socketJob.filter(i => !toInform.some(item => item._jobID == i._jobID))
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


