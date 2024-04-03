const express = require('express');
const { PostController } = require('../controllers');
const { verifyAccessToken } = require('../middlewares/verifyToken')

const router = express.Router();
const postController = new PostController();

router.get('/', verifyAccessToken, postController.getAllPosts);
router.post('/', verifyAccessToken, postController.addPost);
// router.update('/', verifyAccessToken, postController);
// router.delete('/', verifyAccessToken, postController);

module.exports = router;