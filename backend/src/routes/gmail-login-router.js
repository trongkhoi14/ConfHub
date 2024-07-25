const express = require('express');
const { UserController } = require('../controllers');
const passport = require('../services/passport');

const router = express.Router();
const userController = new UserController();

router.get('/', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/callback', passport.authenticate('google'), userController.handleGoogleLogin);

module.exports = router;