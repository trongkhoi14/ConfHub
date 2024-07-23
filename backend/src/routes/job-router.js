const express = require('express');
const { JobController } = require('../controllers');

const router = express.Router();
const jobController = new JobController();

router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.delete('/:id', jobController.deleteJobById);
router.delete('/', jobController.deletePendingJob);

module.exports = router;