const express = require('express');
const cors = require('cors');
const router = require('./src/routes');
const dbConnect = require('./src/config/dbconnect');
const cookieParser = require('cookie-parser');
const { dataSeeding } = require('./src/seeders/data-seeding');
const { notFound, errorHandler } = require('./src/middlewares/errorHandling');
const { rateLimiter } = require('./src/utils/rate-limiter');
const { infoLogger } = require('./src/utils/logger');
const NotificationController = require('./src/controllers/notification-controller');
var cron = require('node-cron');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8081;

app.use(cors());
app.set('trust proxy', true);

// middleware parse cookie
app.use(cookieParser());

// middleware limit number of requests
app.use(rateLimiter);

// middleware log information about the interactions and activities
app.use(infoLogger);

// middleware parse json and req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to database
dbConnect();
// dataSeeding(['admin', 'conferences']);

// create router
router(app);

// middleware handle error
app.use(notFound);
app.use(errorHandler);

// send upcoming notification
cron.schedule("0 */12 * * *", async () => {
	console.log("[" + new Date() + "] Sending email notifications...");
	NotificationController.sendUpcoming();
}, {
	timezone: "Asia/Ho_Chi_Minh"
});

app.listen(port, () => {
	console.log(`Server was running on port ${port}`);
});