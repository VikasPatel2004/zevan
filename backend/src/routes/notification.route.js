const express = require('express');

const router = express.Router();

const notificationController =
require('../controllers/notification.controller');

const authMiddleware =
require('../middleware/auth.middleware');

const roleMiddleware =
require('../middleware/role.middleware');

router.get(

    '/',

    authMiddleware,

    roleMiddleware('OWNER'),

    notificationController.getNotifications

);

module.exports = router;