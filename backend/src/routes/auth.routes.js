const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');

router.post('/signup', authController.signup); // first we have developed for this 
router.post('/login', authController.login); // secondly we are developing for this

module.exports = router;