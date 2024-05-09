const express = require('express');
const { NotificationController } = require('../controllers');
const { verifyAccessToken, checkUserLicense } = require('../middlewares/verifyToken');

const router = express.Router();
const notificationController = new NotificationController();

router.get('/', notificationController.test);

module.exports = router;