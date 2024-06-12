const express = require('express');
const { ViewLoadingController } = require('../controllers/index.js');

const router = express.Router();
const viewLoadingController = new ViewLoadingController();

router.get('/', viewLoadingController.reloading);

module.exports = router;