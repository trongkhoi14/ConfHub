const cron = require('node-cron');
const NotificationController = require('../controllers/notification-controller');
const { createNewLog } = require('../utils/dashboard');

function setupCronJobs() {
    console.log("Cron job is setup.");

    // cron.schedule("*/1 * * * *", async () => {
    cron.schedule("0 0 * * *", async () => {
        console.log("[" + new Date() + "] Sending upcoming notifications emails.");
        NotificationController.sendUpcomingNotification();
        createNewLog();
    }, {
        timezone: "Asia/Ho_Chi_Minh"
    });


}

module.exports = setupCronJobs;