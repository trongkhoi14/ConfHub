const express = require('express');
const { FeedbackController } = require('../controllers');
const { verifyAccessToken } = require('../middlewares/verifyToken');

const router = express.Router();
const feedbackController = new FeedbackController();

router.get('/:id', feedbackController.getFeedback);
router.put('/:id', verifyAccessToken, feedbackController.updateFeedback);
router.delete('/:id', verifyAccessToken, feedbackController.deleteFeedback);

module.exports = router;