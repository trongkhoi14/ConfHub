const express = require('express');
const { NotificationController } = require('../controllers');
const { verifyAccessToken, checkUserLicense } = require('../middlewares/verifyToken');

const router = express.Router();
const notificationController = new NotificationController();

router.get('/', verifyAccessToken, notificationController.getAllNotifications);
router.get('/:id', verifyAccessToken, notificationController.getNotification);
router.get('/test', notificationController.test);

module.exports = router;