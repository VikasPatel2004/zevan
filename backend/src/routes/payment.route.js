const express = require('express');

const router = express.Router();

const paymentController =
require('../controllers/payment.controller');

const authMiddleware =
require('../middleware/auth.middleware');

const roleMiddleware =
require('../middleware/role.middleware');

router.get(

    '/my-history',

    authMiddleware,

    roleMiddleware('RESIDENT'),

    paymentController.getMyRechargeHistory

);

router.get(

    '/mess-history',

    authMiddleware,

    roleMiddleware('OWNER'),

    paymentController.getMessPayments

);

module.exports = router;