const express = require('express');
const { ConferenceCFPController } = require('../controllers');

const router = express.Router();
const conferenceCFPController = new ConferenceCFPController();

router.get('/', conferenceCFPController.getAllConferences);
router.get('/:id', conferenceCFPController.getConferenceDetail);

module.exports = router;