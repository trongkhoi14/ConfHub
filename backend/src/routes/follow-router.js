const express = require('express');
const { FollowController } = require('../controllers');
const { verifyAccessToken } = require('../middlewares/verifyToken');

const router = express.Router();
const followController = new FollowController();

router.get('/', verifyAccessToken, followController.getFollowedConferences);
router.post('/', verifyAccessToken, followController.follow);
router.delete('/', verifyAccessToken, followController.unfollow);

module.exports = router;