const express = require('express');
const { ConferenceController } = require('../controllers');

const router = express.Router();
const conferenceController = new ConferenceController();

router.get('/', conferenceController.getAll);
router.get('/:id/detail', conferenceController.getDetail);

module.exports = router;