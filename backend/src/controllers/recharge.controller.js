const Recharge = require('../models/recharge.model');
const Resident = require('../models/resident.model');

exports.addRecharge = async (req, res) => {
    try {
        const {
            residentId,
            amountPaid,
            mealsAdded,
            paymentMethod
        } = req.body;

        // Basic validation
        if (!residentId || !amountPaid || !mealsAdded || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (residentId, amountPaid, mealsAdded, paymentMethod)'
            });
        }

        const resident = await Resident.findById(residentId);

        if (!resident) {
            return res.status(404).json({
                success: false,
                message: 'Resident not found'
            });
        }

        // Convert to numbers to avoid calculation issues
        const addMeals = Number(mealsAdded);
        const paidAmount = Number(amountPaid);

        if (isNaN(addMeals) || isNaN(paidAmount)) {
            return res.status(400).json({
                success: false,
                message: 'Amount paid and meals added must be numbers'
            });
        }

        resident.totalPurchasedMeals = (resident.totalPurchasedMeals || 0) + addMeals;
        resident.mealsRemaining = (resident.mealsRemaining || 0) + addMeals;

        await resident.save();

        const recharge = await Recharge.create({
            resident: residentId,
            amountPaid: paidAmount,
            mealsAdded: addMeals,
            paymentMethod,
            addedBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Recharge added successfully',
            recharge,
            wallet: {
                totalPurchasedMeals: resident.totalPurchasedMeals,
                mealsConsumed: resident.mealsConsumed || 0,
                mealsRemaining: resident.mealsRemaining
            }
        });

    } catch (error) {
        console.error("Error in addRecharge:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};