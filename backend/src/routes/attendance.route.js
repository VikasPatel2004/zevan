const express = require('express');

const router = express.Router();

const attendanceController = require('../controllers/attendance.controller');

const authMiddleware = require('../middleware/auth.middleware');

const roleMiddleware = require('../middleware/role.middleware');

router.post(
   '/mark',
   authMiddleware,
   attendanceController.markAttendance
);

router.get(
    '/today',
    authMiddleware,
    roleMiddleware('OWNER'),
    attendanceController.getTodayAttendance
);

router.post(
    '/bulk-mark',
    authMiddleware,
    roleMiddleware('OWNER'),
    attendanceController.bulkMarkAttendance
);

module.exports = router;