const express = require('express');

const router = express.Router();

const billController = require('../controllers/bill.controller');

const authMiddleware = require('../middleware/auth.middleware');

const roleMiddleware = require('../middleware/role.middleware');

router.post(
   '/generate',
   authMiddleware,
   roleMiddleware('OWNER'),
   billController.generateBill
);

module.exports = router;