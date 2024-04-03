const express = require('express');
const { SourceController } = require('../controllers');

const router = express.Router();
const sourceController = new SourceController();

router.get('/', sourceController.getAll);

module.exports = router;