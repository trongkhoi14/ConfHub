const cron = require('node-cron');
const NotificationController = require('../controllers/notification-controller');
const { createNewLog } = require('../utils/dashboard');
const { selectUpcomingEvents } = require('../services/notification-services.js');
const { conferenceData } = require('../temp/index.js');
const { addCrawlJob } = require('../utils/crawl-job.js');
const model = require('../models');

let crawlCycleCron = null;
let runningCycle = null;

async function setupCronJobs() {
    console.log("Cron job is setup.");

    runningCycle = await model.updateCycleModel.findOne();
    createOrUpdateCronJob(runningCycle.cycle);

    runDailyCron();
    runUpdateCycleCron();
}

function runDailyCron() {
    // cron.schedule("*/1 * * * *", async () => {
    cron.schedule("0 0 * * *", async () => {
        console.log("[" + new Date() + "] Sending upcoming notifications emails.");
        NotificationController.sendUpcomingNotification();
        createNewLog();

    }, {
        timezone: "Asia/Ho_Chi_Minh"
    });
}

function createOrUpdateCronJob(cycle) {
    if (crawlCycleCron) {
        crawlCycleCron.stop();
    }

    const cronExpression = `30 0 */${cycle} * *`;

    crawlCycleCron = cron.schedule(cronExpression, async () => {
        console.log(Date() + `Cron job chạy với chu kỳ: ${cycle}`);
        const events = await selectUpcomingEvents(runningCycle.period);
        const cfp_ids = new Set(events.map(event => event.cfp_id));
        const nkeys = conferenceData.listOfConferences.filter(obj => cfp_ids.has(obj.id) && obj.information.nkey != null).map(obj => obj.information.nkey);
        for (const nkey of nkeys) {
            await addCrawlJob(nkey, "update now");
        }

    }, {
        timezone: "Asia/Ho_Chi_Minh"
    });
}

function runUpdateCycleCron() {
    try {
        setInterval(async () => {
            const currentCycle = await model.updateCycleModel.findOne();

            if (currentCycle.cycle != runningCycle.cycle) {
                console.log(Date() + `Phát hiện thay đổi chu kỳ từ ${runningCycle.cycle} thành ${currentCycle.cycle}`);
                createOrUpdateCronJob(currentCycle.cycle);
                runningCycle = currentCycle;
            }
        }, 2 * 60 * 60 * 1000); // Kiểm tra mỗi 2 * 60 * 60 * 1000 ms
    } finally {
        // Không đóng kết nối ở đây nếu setInterval đang sử dụng
    }
}


module.exports = setupCronJobs;