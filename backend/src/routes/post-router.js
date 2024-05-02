const express = require('express');
const { PostController } = require('../controllers');
const { verifyAccessToken, checkUserLicense } = require('../middlewares/verifyToken');

const router = express.Router();
const postController = new PostController();

router.get('/', verifyAccessToken, checkUserLicense, postController.getAllPosts);
router.post('/', verifyAccessToken, checkUserLicense, postController.addPost);
router.put('/:id', verifyAccessToken, checkUserLicense, postController.updatePost);
router.delete('/:id', verifyAccessToken, checkUserLicense, postController.deletePost);

module.exports = router;