const express = require('express');

const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');

const authMiddleware = require('../middleware/auth.middleware');

const roleMiddleware = require('../middleware/role.middleware');

router.get(
   '/owner',
   authMiddleware,
   roleMiddleware('OWNER'),
   dashboardController.getOwnerDashboard
);

module.exports = router;