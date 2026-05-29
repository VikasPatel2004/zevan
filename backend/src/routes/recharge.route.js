const express = require('express');

const router = express.Router();

const rechargeController =
require('../controllers/recharge.controller');

const authMiddleware =
require('../middleware/auth.middleware');

const roleMiddleware =
require('../middleware/role.middleware');

router.post(
   '/add',
   authMiddleware,
   roleMiddleware('OWNER'),
   rechargeController.addRecharge
);

module.exports = router;