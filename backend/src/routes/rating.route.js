const express = require('express');

const router = express.Router();

const ratingController =
require('../controllers/rating.controller');

const authMiddleware =
require('../middleware/auth.middleware');

const roleMiddleware =
require('../middleware/role.middleware');

router.post(

    '/submit',

    authMiddleware,

    roleMiddleware('RESIDENT'),

    ratingController.submitRating

);

router.get(

    '/all',

    authMiddleware,

    roleMiddleware('OWNER'),

    ratingController.getMessRatings

);

module.exports = router;