const Resident = require('../models/resident.model');
const Attendance = require('../models/Attendance.model');

exports.markAttendance = async (req, res) => {
    try {
        const { residentId, morning, evening } = req.body;

        const resident = await Resident.findById(residentId);
        if (!resident) {
            return res.status(404).json({
                success: false,
                message: "Resident not found"
            });
        }

        // Security Check: Resident can only mark their own attendance
        if (req.user.role === 'RESIDENT' && resident.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to mark attendance for others"
            });
        }

        const today = new Date().toLocaleDateString('en-CA', {
            timeZone: 'Asia/Kolkata'
        });

        let attendance = await Attendance.findOne({
            resident: residentId,
            date: today
        });

        let mealsToDeduct = 0;
        let mealsToRefund = 0;

        if (attendance) {
            // Check for additions and removals
            if (!attendance.morning && morning) mealsToDeduct += 1;
            if (attendance.morning && !morning) mealsToRefund += 1;
            if (!attendance.evening && evening) mealsToDeduct += 1;
            if (attendance.evening && !evening) mealsToRefund += 1;
            
            attendance.morning = morning;
            attendance.evening = evening;
            await attendance.save();
        } else {
            if (morning) mealsToDeduct += 1;
            if (evening) mealsToDeduct += 1;

            attendance = await Attendance.create({
                resident: residentId,
                mess: resident.mess,
                date: today,
                morning,
                evening,
                markedBy: req.user.id
            });
        }

        // Wallet & Overdue Logic
        if (mealsToDeduct > 0) {
            let remainingToDeduct = mealsToDeduct;
            
            // 1. Deduct from prepaid balance first
            if (resident.mealsRemaining > 0) {
                const canDeduct = Math.min(resident.mealsRemaining, remainingToDeduct);
                resident.mealsRemaining -= canDeduct;
                remainingToDeduct -= canDeduct;
            }
            
            // 2. Any remaining goes to overdue (loan)
            if (remainingToDeduct > 0) {
                resident.overdueMeals = (resident.overdueMeals || 0) + remainingToDeduct;
            }

            resident.mealsConsumed += mealsToDeduct;
            await resident.save();
        }

        if (mealsToRefund > 0) {
            let remainingRefund = mealsToRefund;
            if (resident.overdueMeals > 0) {
                const canReduceOverdue = Math.min(resident.overdueMeals, remainingRefund);
                resident.overdueMeals -= canReduceOverdue;
                remainingRefund -= canReduceOverdue;
            }
            if (remainingRefund > 0) {
                resident.mealsRemaining += remainingRefund;
            }
            resident.mealsConsumed = Math.max(0, resident.mealsConsumed - mealsToRefund);
            await resident.save();
        }

        res.status(200).json({
            success: true,
            message: "Attendance marked successfully",
            attendance,
            wallet: {
                totalPurchasedMeals: resident.totalPurchasedMeals,
                mealsConsumed: resident.mealsConsumed,
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

// For owners to get today's attendance for their mess
exports.getTodayAttendance = async (req, res) => {
    try {
        const mess = await require('../models/mess.model').findOne({ owner: req.user.id });
        if (!mess) {
            return res.status(404).json({ success: false, message: "Mess not found" });
        }

        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        
        const residents = await Resident.find({ mess: mess._id, isActive: true }).populate('user', 'name');
        const attendances = await Attendance.find({ mess: mess._id, date: today });

        const data = residents.map(r => {
            const att = attendances.find(a => a.resident.toString() === r._id.toString());
            // Map FULL to Both for frontend compatibility
            const displayPlan = r.planType === 'FULL' ? 'Both' : (r.planType === 'HALF' ? 'Lunch' : r.planType);
            
            return {
                id: r._id,
                name: r.user ? r.user.name : "Unknown",
                plan: displayPlan,
                morning: att ? att.morning : false,
                evening: att ? att.evening : false
            };
        });

        res.status(200).json({ success: true, attendance: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.bulkMarkAttendance = async (req, res) => {
    try {
        const { attendances } = req.body; 

        await Promise.all(attendances.map(async (att) => {
            const { residentId, morning, evening } = att;
            const resident = await Resident.findById(residentId);
            if (!resident) return;

            const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
            let attendance = await Attendance.findOne({ resident: residentId, date: today });

            let mealsToDeduct = 0;
            let mealsToRefund = 0;
            if (attendance) {
                if (!attendance.morning && morning) mealsToDeduct += 1;
                if (attendance.morning && !morning) mealsToRefund += 1;
                if (!attendance.evening && evening) mealsToDeduct += 1;
                if (attendance.evening && !evening) mealsToRefund += 1;
                attendance.morning = morning;
                attendance.evening = evening;
                await attendance.save();
            } else {
                if (morning) mealsToDeduct += 1;
                if (evening) mealsToDeduct += 1;
                attendance = await Attendance.create({
                    resident: residentId,
                    mess: resident.mess,
                    date: today,
                    morning,
                    evening,
                    markedBy: req.user.id
                });
            }

            if (mealsToDeduct > 0) {
                let remainingToDeduct = mealsToDeduct;
                
                // 1. Deduct from prepaid balance first
                if (resident.mealsRemaining > 0) {
                    const canDeduct = Math.min(resident.mealsRemaining, remainingToDeduct);
                    resident.mealsRemaining -= canDeduct;
                    remainingToDeduct -= canDeduct;
                }
                
                // 2. Any remaining goes to overdue
                if (remainingToDeduct > 0) {
                    resident.overdueMeals = (resident.overdueMeals || 0) + remainingToDeduct;
                }

                resident.mealsConsumed += mealsToDeduct;
                await resident.save();
            }

            if (mealsToRefund > 0) {
                let remainingRefund = mealsToRefund;
                if (resident.overdueMeals > 0) {
                    const canReduceOverdue = Math.min(resident.overdueMeals, remainingRefund);
                    resident.overdueMeals -= canReduceOverdue;
                    remainingRefund -= canReduceOverdue;
                }
                if (remainingRefund > 0) {
                    resident.mealsRemaining += remainingRefund;
                }
                resident.mealsConsumed = Math.max(0, resident.mealsConsumed - mealsToRefund);
                await resident.save();
            }
        }));

        res.status(200).json({ success: true, message: "Attendance updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};