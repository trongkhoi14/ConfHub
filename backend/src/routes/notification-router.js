const express = require('express');
const { NotificationController } = require('../controllers');
const { verifyAccessToken } = require('../middlewares/verifyToken');

const router = express.Router();
const notificationController = new NotificationController();

router.get('/', verifyAccessToken, notificationController.getAllNotifications);
router.post('/:id', verifyAccessToken, notificationController.getNotification);

module.exports = router;