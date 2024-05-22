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
const http = require('http');
const { initSocket, users } = require('./src/config/socket');
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

// Create HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const io = initSocket(server);

io.on('connection', (socket) => {
	const userID = socket.handshake.query['user-id'];

	if (userID) {
		users.set(userID, socket.id);
		console.log(`User ${userID} registered with socket ID ${socket.id}`);
	} else {
		console.log('No user ID found in headers');
	}

	socket.on('disconnect', () => {
		console.log('User disconnected');
		for (let [userID, socketID] of users) {
			if (socketID === socket.id) {
				users.delete(userID);
				break;
			}
		}
	});
});

// send upcoming notification
// cron.schedule('*/1 * * * *', () => {
cron.schedule("0 */12 * * *", async () => {
	console.log("[" + new Date() + "] Sending upcoming notifications emails.");
	NotificationController.sendUpcomingNotification();
}, {
	timezone: "Asia/Ho_Chi_Minh"
});

server.listen(port, () => {
	console.log(`Server was running on port ${port}`);
});