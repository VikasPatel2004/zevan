const express = require('express');

const router = express.Router();

const dashboardController =
require('../controllers/residentDashboard.controller');

const authMiddleware =
require('../middleware/auth.middleware');

const roleMiddleware =
require('../middleware/role.middleware');

router.get(
    '/',
    authMiddleware,
    roleMiddleware('RESIDENT'),
    dashboardController.getDashboard
);

module.exports = router;