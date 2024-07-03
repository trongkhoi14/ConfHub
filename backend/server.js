const express = require('express');
const cors = require('cors');
const router = require('./src/routes');
const dbConnect = require('./src/config/dbconnect');
const crawlerDBConnect = require('./src/config/crawlerdb');
const cookieParser = require('cookie-parser');
const { dataSeeding } = require('./src/seeders/data-seeding');
const { notFound, errorHandler } = require('./src/middlewares/errorHandling');
const { rateLimiter } = require('./src/utils/rate-limiter');
const { infoLogger } = require('./src/utils/logger');
const http = require('http');
const { initSocket, socketListening } = require('./src/config/socket');
const { loadDataForFilter, loadInactiveConference } = require('./src/temp/index');
const { createNewLog } = require('./src/utils/dashboard');
const session = require('express-session');
const passport = require('./src/services/passport');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8081;
process.env.TZ = "Asia/Ho_Chi_Minh"

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

// express-session middleware
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// create router
router(app);

// connect to database
dbConnect();
// dataSeeding(['admin', 'conferences']);
crawlerDBConnect();

// middleware handle error
app.use(notFound);
app.use(errorHandler);

// Create HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const io = initSocket(server);
socketListening(io);

// Schedule the cron job for sending upcoming notification emails
const setupCronJobs = require('./src/config/cron-job');
setupCronJobs();

// create log
createNewLog();

// read conference list
loadDataForFilter();
loadInactiveConference();

// change stream
const { monitorChanges } = require('./src/services/change-stream');
monitorChanges();

server.listen(port, () => {
	console.log(`Server was running on port ${port}`);
});