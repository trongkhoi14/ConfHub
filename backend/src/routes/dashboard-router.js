const express = require('express');
const { DashboardController } = require('../controllers/index.js');

const router = express.Router();
const dashboardController = new DashboardController();

router.get('/currentUser', dashboardController.getLoginUsers);
router.get('/userLog', dashboardController.getUserLog);
router.get('/etlLog', dashboardController.getETLLog);

module.exports = router;