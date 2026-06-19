const Resident = require('../models/resident.model');
const Mess = require('../models/mess.model');

exports.getMessBilling = async (req, res) => {
    try {
        const mess = await Mess.findOne({ owner: req.user.id });
        if (!mess) {
            return res.status(404).json({ success: false, message: "Mess not found" });
        }

        const residents = await Resident.find({ mess: mess._id }).populate('user', 'name phone');

        const billingData = residents.map(r => ({
            id: r._id,
            name: r.user.name,
            phone: r.user.phone,
            plan: r.planType,
            attended: r.mealsConsumed,
            totalMeals: r.totalPurchasedMeals,
            mealsRemaining: r.mealsRemaining,
            amount: Math.round((r.mealsConsumed / Math.max(r.totalPurchasedMeals, 1)) * 3000), // Mock formula
            status: r.isActive ? 'Pending' : 'Settled'
        }));

        res.status(200).json({ success: true, billing: billingData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
