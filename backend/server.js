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
const NotificationController = require('./src/controllers/notification-controller');
const http = require('http');
const { initSocket, users } = require('./src/config/socket');
const { loadDataForFilter, loadInactiveConference } = require('./src/temp/index');
var cron = require('node-cron');
const { createNewLog, increaseUserLog } = require('./src/utils/dashboard');
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
crawlerDBConnect();

// create router
router(app);

// middleware handle error
app.use(notFound);
app.use(errorHandler);

// Create HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const io = initSocket(server);

io.on('connection', (socket) => {
	let userID = socket.handshake.query['user-id'];

	if (!userID || userID == 'null') {
		userID = 'guest' + Math.random();
	}

	if (userID) {
		users.set(socket.id, userID);
		console.log(`User ${userID} registered with socket ID ${socket.id}`);
		io.emit('currentUser', users.size);
		increaseUserLog();

	} else {
		console.log('No user ID found in headers.');
	}

	socket.on('disconnect', () => {
		console.log('User disconnected');
		// for (let [socketID, userID] of users) {
		// 	if (socketID === socket.id) {
		// 		users.delete(userID);
		// 		break;
		// 	}
		// }
		users.delete(socket.id);
		io.emit('currentUser', users.size);
	});
});

// send upcoming notification
// cron.schedule("*/1 * * * *", async () => {
cron.schedule("0 0 * * *", async () => {
	console.log("[" + new Date() + "] Sending upcoming notifications emails.");
	NotificationController.sendUpcomingNotification();
	createNewLog();
}, {
	timezone: "Asia/Ho_Chi_Minh"
});

// create log
createNewLog();

// read conference list
loadDataForFilter();
loadInactiveConference();

process.env.TZ = "Asia/Ho_Chi_Minh"

// change stream
const { monitorChanges } = require('./src/services/change-stream');
monitorChanges();

server.listen(port, () => {
	console.log(`Server was running on port ${port}`);
});