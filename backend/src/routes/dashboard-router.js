const express = require('express');
const { DashboardController } = require('../controllers/index.js');

const router = express.Router();
const dashboardController = new DashboardController();

router.get('/currentUser', dashboardController.getLoggingUsers);

module.exports = router;