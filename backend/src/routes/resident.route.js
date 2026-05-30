const express = require('express');

const router = express.Router();

const residentController =
require('../controllers/resident.controller');

const authMiddleware =
require('../middleware/auth.middleware');

const roleMiddleware =
require('../middleware/role.middleware');

router.get(
    '/details/:residentId',
    authMiddleware,
    roleMiddleware('OWNER'),
    residentController.getResidentDetails
);

router.put(
    '/deactivate/:residentId',
    authMiddleware,
    roleMiddleware('OWNER'),
    residentController.deactivateResident
);

module.exports = router;