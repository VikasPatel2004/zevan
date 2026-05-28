const express = require('express');

const router = express.Router();

const menuController = require('../controllers/menu.controller');

const authMiddleware = require('../middleware/auth.middleware');

const roleMiddleware = require('../middleware/role.middleware');


router.post(
   '/update',
   authMiddleware,
   roleMiddleware('OWNER'),
   menuController.updateMenu
);

router.get(
   '/today',
   authMiddleware,
   roleMiddleware('RESIDENT'),
   menuController.getTodayMenu
);

module.exports = router;