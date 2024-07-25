const express = require('express');
const { SourceController } = require('../controllers');

const router = express.Router();
const sourceController = new SourceController();

router.get('/', sourceController.getAllSource);

module.exports = router;