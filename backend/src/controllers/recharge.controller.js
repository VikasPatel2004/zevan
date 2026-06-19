const Recharge = require('../models/recharge.model');
const Resident = require('../models/resident.model');
const Activity = require('../models/activity.model');
const Notification = require('../models/notification.model');
const User = require('../models/user.model');

exports.addRecharge = async (req, res) => {
    try {
        const { residentId, amountPaid, mealsAdded, paymentMethod } = req.body;

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

        const addMeals = Number(mealsAdded);
        const paidAmount = Number(amountPaid);

        if (isNaN(addMeals) || isNaN(paidAmount)) {
            return res.status(400).json({
                success: false,
                message: 'Amount paid and meals added must be numbers'
            });
        }

        let mealsToActuallyAdd = addMeals;
        
        // 1. Settle overdue meals first
        if (resident.overdueMeals > 0) {
            const settlement = Math.min(resident.overdueMeals, mealsToActuallyAdd);
            resident.overdueMeals -= settlement;
            mealsToActuallyAdd -= settlement;
        }

        resident.totalPurchasedMeals = (resident.totalPurchasedMeals || 0) + addMeals;
        resident.mealsRemaining = (resident.mealsRemaining || 0) + mealsToActuallyAdd;
        await resident.save();

        const recharge = await Recharge.create({
            resident: residentId,
            amountPaid: paidAmount,
            mealsAdded: addMeals,
            paymentMethod,
            addedBy: req.user.id
        });

        const owner = await User.findById(req.user.id);

        await Activity.create({
            mess: resident.mess,
            title: 'Recharge Added',
            description: `${owner.name} added ${addMeals} meals`
        });

        await Notification.create({
            mess: resident.mess,
            title: 'Recharge Added',
            description: `${owner.name} added ${addMeals} meals`
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
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getRechargeHistory = async (req, res) => {
    try {
        let recharges;
        if (req.user.role === 'RESIDENT') {
            const resident = await Resident.findOne({ user: req.user.id });
            if (!resident) {
                return res.status(404).json({ success: false, message: "Resident not found" });
            }
            recharges = await Recharge.find({ resident: resident._id }).sort({ createdAt: -1 });
        } else if (req.user.role === 'OWNER') {
            const mess = await require('../models/mess.model').findOne({ owner: req.user.id });
            if (!mess) {
                return res.status(404).json({ success: false, message: "Mess not found" });
            }
            const residents = await Resident.find({ mess: mess._id });
            const residentIds = residents.map(r => r._id);
            recharges = await Recharge.find({ resident: { $in: residentIds } })
                .populate({
                    path: 'resident',
                    populate: { path: 'user', select: 'name' }
                })
                .sort({ createdAt: -1 });
        }
        res.status(200).json({ success: true, recharges });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getResidentThaliStatus = async (req, res) => {
    try {
        const mess = await require('../models/mess.model').findOne({ owner: req.user.id });
        if (!mess) {
            return res.status(404).json({ success: false, message: "Mess not found" });
        }

        const residents = await Resident.find({ mess: mess._id }).populate('user', 'name phone');

        const statusData = residents.map(r => ({
            id: r._id,
            name: r.user.name,
            phone: r.user.phone,
            plan: r.planType,
            consumed: r.mealsConsumed || 0,
            remaining: r.mealsRemaining || 0,
            overdue: r.overdueMeals || 0,
            totalPurchased: r.totalPurchasedMeals || 0
        }));

        res.status(200).json({ success: true, residents: statusData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};