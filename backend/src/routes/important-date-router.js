const express = require('express');
const { ImportantDateController } = require('../controllers');

const router = express.Router();
const importantDateController = new ImportantDateController();

router.get('/:id', importantDateController.getDate);

module.exports = router;