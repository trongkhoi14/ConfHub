const express = require('express');
const { ConferenceCFPController, ImportantDateController, OrganizationController, FeedbackController } = require('../controllers');
const { getCurrentUser, verifyAccessToken, checkAdminRole } = require('../middlewares/verifyToken');

const router = express.Router();
const conferenceCFPController = new ConferenceCFPController();
const importantDateController = new ImportantDateController();
const organizationController = new OrganizationController();
const feedbackController = new FeedbackController();

router.get('/', conferenceCFPController.getAllConferences);
router.get('/:id', conferenceCFPController.getConferenceDetail);
router.get('/:id/dates', importantDateController.getConferenceDates);
router.get('/:id/org', organizationController.getConferenceOrganizations);
router.get('/:id/feedback', feedbackController.getAllFeedbacks);
router.post('/:id/feedback', verifyAccessToken, feedbackController.addFeedback);

router.put('/:id/updateNow', getCurrentUser, conferenceCFPController.updateNow);
router.delete('/:id', verifyAccessToken, checkAdminRole, conferenceCFPController.deleteCallForPaper);

module.exports = router;