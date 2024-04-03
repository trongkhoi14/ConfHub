const express = require('express');
const { FieldOfResearchController } = require('../controllers');

const router = express.Router();
const fieldOfResearchController = new FieldOfResearchController();

router.get('/', fieldOfResearchController.getAll);

module.exports = router;