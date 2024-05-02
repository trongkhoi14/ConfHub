const express = require('express');
const { ConferenceCFPController, ImportantDateController, OrganizationController } = require('../controllers');
const { getCurrentUser } = require('../middlewares/verifyToken');

const router = express.Router();
const conferenceCFPController = new ConferenceCFPController();
const importantDateController = new ImportantDateController();
const organizationController = new OrganizationController();

router.get('/', getCurrentUser, conferenceCFPController.getAllConferences);
router.get('/:id', conferenceCFPController.getConferenceDetail);
router.get('/:id/dates', importantDateController.getConferenceDates);
router.get('/:id/org', organizationController.getConferenceOrganizations);

module.exports = router;