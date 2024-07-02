const express = require('express');
const { JobController } = require('../controllers');
const { verifyAccessToken, checkUserLicense } = require('../middlewares/verifyToken');

const router = express.Router();
const jobController = new JobController();

router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);

module.exports = router;