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

// route for getting all messes for discovery page
router.get(
    '/all',
    messController.getAllMesses
);

// get own mess (Owner only)
router.get('/my', authMiddleware, messController.getMyMess);

// get mess by id
router.get('/:id', messController.getMessById);

// update mess (Owner only)
router.put('/update', authMiddleware, roleMiddleware('OWNER'), messController.updateMess);

// get similar messes
router.get('/:id/similar', messController.getSimilarMesses);




module.exports = router;