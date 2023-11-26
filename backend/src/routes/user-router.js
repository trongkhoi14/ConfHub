const express = require('express');
const { UserController } = require('../controllers');

const router = express.Router();
const userController = new UserController();

router.get('/all', userController.getAll);

module.exports = router;