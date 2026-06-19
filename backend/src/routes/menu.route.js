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
    '/weekly',
    authMiddleware,
    menuController.getWeeklyMenu
);

router.post(
    '/weekly/update',
    authMiddleware,
    roleMiddleware('OWNER'),
    menuController.updateWeeklyMenu
);

router.get(
    '/today',
    authMiddleware,
    roleMiddleware('RESIDENT'),
    menuController.getResidentTodayMenu
);

module.exports = router;