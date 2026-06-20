const Rating = require('../models/rating.model');
const Mess = require('../models/mess.model');
const Resident = require('../models/resident.model');

// Add a review
exports.addReview = async (req, res) => {
    try {
        const { messId, rating, hygieneRating, review, date } = req.body;

        // Check if student is a resident of this mess
        const resident = await Resident.findOne({ user: req.user.id, mess: messId });
        if (!resident) {
            return res.status(403).json({
                success: false,
                message: "You can only review messes you have joined."
            });
        }

        const newReview = await Rating.create({
            resident: resident._id,
            mess: messId,
            rating,
            hygieneRating,
            review,
            date: date || new Date().toISOString()
        });

        // Update average rating and hygiene in Mess model in background or here
        // For simplicity, we'll calculate it when fetching the mess, 
        // but we can also update it here to keep the collection optimized
        const reviews = await Rating.find({ mess: messId });
        const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
        const avgHygiene = reviews.reduce((acc, curr) => acc + curr.hygieneRating, 0) / reviews.length;

        let hygieneGrade = 'A';
        if (avgRating > 4) hygieneGrade = 'A';
        else if (avgRating >= 3) hygieneGrade = 'B';
        else hygieneGrade = 'C';

        await Mess.findByIdAndUpdate(messId, {
            rating: parseFloat(avgRating.toFixed(1)),
            hygiene: hygieneGrade
        });

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review: newReview
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get reviews for a mess
exports.getMessReviews = async (req, res) => {
    try {
        const { messId } = req.params;
        const reviews = await Rating.find({ mess: messId })
            .populate({
                path: 'resident',
                populate: { path: 'user', select: 'name' }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};