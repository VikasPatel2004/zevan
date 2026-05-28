const express = require('express');

const router = express.Router();

const attendanceController = require('../controllers/attendance.controller');

const authMiddleware = require('../middleware/auth.middleware');

const roleMiddleware = require('../middleware/role.middleware');

router.post(
   '/mark',
   authMiddleware,
   roleMiddleware('OWNER'),
   attendanceController.markAttendance
);

module.exports = router;