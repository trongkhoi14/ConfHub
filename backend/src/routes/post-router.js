const express = require('express');
const { PostController } = require('../controllers');
const { verifyAccessToken, checkAdminRole } = require('../middlewares/verifyToken');

const router = express.Router();
const postController = new PostController();

router.get('/', verifyAccessToken, postController.getAllPosts);
router.post('/', verifyAccessToken, postController.addPost);
router.put('/:id', verifyAccessToken, postController.updatePost);
router.delete('/:id', verifyAccessToken, postController.deletePost);
router.post('/etl', postController.etlPost);

router.put('/:id/activate', verifyAccessToken, checkAdminRole, postController.activatePost);
router.put('/:id/deactivate', verifyAccessToken, checkAdminRole, postController.deactivatePost);

module.exports = router;