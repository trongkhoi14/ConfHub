const express = require('express');
const { RankController } = require('../controllers');

const router = express.Router();
const rankController = new RankController();

router.get('/', rankController.getAllRanks);

module.exports = router;