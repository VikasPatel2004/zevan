const express = require('express');
const router = express.Router();

// importin mess controller and auth and role middleware for role based access 
const messController = require('../controllers/mess.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// route for creating the mess with auth and role middleware as only owner can create the mess 
router.post(
   '/create',
   authMiddleware,
   roleMiddleware('OWNER'),
   messController.createMess
);

// route for joining the mess with auth and role middleware as only resident can join the mess 
router.post(
   '/join',
   authMiddleware,
   roleMiddleware('RESIDENT'),
   messController.joinMess
);




module.exports = router;