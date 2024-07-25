const express = require('express');
const UpdateCycleController = require('../controllers/update-cycle-controller');
const { verifyAccessToken, checkAdminRole } = require('../middlewares/verifyToken');

const router = express.Router();
const updateCycleController = new UpdateCycleController();

router.get('/', updateCycleController.getCycle);
router.put('/', verifyAccessToken, checkAdminRole, updateCycleController.updateCycle);

module.exports = router;