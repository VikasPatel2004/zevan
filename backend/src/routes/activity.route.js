const express = require('express');

const router = express.Router();

const activityController =
require('../controllers/activity.controller');

const authMiddleware =
require('../middleware/auth.middleware');

const roleMiddleware =
require('../middleware/role.middleware');

router.get(

    '/',

    authMiddleware,

    roleMiddleware('OWNER'),

    activityController.getActivities

);

module.exports = router;