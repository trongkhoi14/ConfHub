const express = require('express');
const { ConferenceCFPController, ImportantDateController, OrganizationController, FeedbackController } = require('../controllers');
const { getCurrentUser, verifyAccessToken, checkAdminRole } = require('../middlewares/verifyToken');
const FileController = require('../controllers/file-controller');

const router = express.Router();
const conferenceCFPController = new ConferenceCFPController();
const importantDateController = new ImportantDateController();
const organizationController = new OrganizationController();
const feedbackController = new FeedbackController();
const fileController = new FileController();

router.get('/', conferenceCFPController.getAllConferences);
router.get('/:id', getCurrentUser, conferenceCFPController.getConferenceDetail);
router.get('/:id/dates', importantDateController.getConferenceDates);
router.get('/:id/org', organizationController.getConferenceOrganizations);
router.get('/:id/feedback', feedbackController.getAllFeedbacks);
router.post('/:id/feedback', verifyAccessToken, feedbackController.addFeedback);

router.get('/top/view', conferenceCFPController.selectTopView);

router.put('/:id/updateNow', conferenceCFPController.updateNow);
router.delete('/:id', verifyAccessToken, checkAdminRole, conferenceCFPController.deleteCallForPaper);
router.post('/file/import', verifyAccessToken, checkAdminRole, fileController.insert);

module.exports = router;