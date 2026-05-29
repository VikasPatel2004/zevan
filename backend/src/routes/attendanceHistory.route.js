const express = require('express');

const router = express.Router();

const attendanceController =
require('../controllers/attendanceHistory.controller');

const authMiddleware =
require('../middleware/auth.middleware');

const roleMiddleware =
require('../middleware/role.middleware');

router.get(

    '/my-attendance',

    authMiddleware,

    roleMiddleware('RESIDENT'),

    attendanceController.getMyAttendance

);

module.exports = router;