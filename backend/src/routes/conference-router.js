const express = require('express');
const { ConferenceController } = require('../controllers');

const router = express.Router();
const conferenceController = new ConferenceController();

router.get('/acronym', conferenceController.getAllAcronyms);

module.exports = router;