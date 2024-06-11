const express = require('express');
const { ViewLoadingController } = require('../controllers/index.js');

const router = express.Router();
const viewLoadingController = new ViewLoadingController();

router.get('/', viewLoadingController.reloading);


const Test = require('../controllers/test.js')
const test = new Test()
router.get('/test', test.test);

module.exports = router;