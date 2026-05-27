const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const authController = require('../controllers/auth.controller');

// route for checking the valid user it is a auth middleware
router.get(
   '/me',
   authMiddleware,
   (req,res) => {

      res.status(200).json({
         success: true,
         user: req.user
      });

   }
);

// route for checking the owner it is a auth and role middleware
router.get(
   '/owner-test',
   authMiddleware,
   roleMiddleware('OWNER'),
   (req,res) => {

      res.send("Welcome Owner");

   }
);

//routes for signup and login 
router.post('/signup', authController.signup); // first we have developed for this 
router.post('/login', authController.login); // secondly we are developing for this

module.exports = router;