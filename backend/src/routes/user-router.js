const express = require('express');
const { UserController } = require('../controllers');

const router = express.Router();
const userController = new UserController();

// --> /api/v1/user

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout)
router.get('/all', userController.getAll);

module.exports = router;