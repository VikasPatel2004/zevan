const express = require('express');

const router = express.Router();

const leaveController =
require('../controllers/leave.controller');

const authMiddleware =
require('../middleware/auth.middleware');

const roleMiddleware =
require('../middleware/role.middleware');

router.post(
    '/apply',
    authMiddleware,
    roleMiddleware('RESIDENT'),
    leaveController.applyLeave
);

router.put(
    '/approve/:leaveId',
    authMiddleware,
    roleMiddleware('OWNER'),
    leaveController.approveLeave
);

module.exports = router;