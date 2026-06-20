const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.post('/add', authMiddleware, roleMiddleware('RESIDENT'), ratingController.addReview);
router.get('/mess/:messId', ratingController.getMessReviews);

module.exports = router;