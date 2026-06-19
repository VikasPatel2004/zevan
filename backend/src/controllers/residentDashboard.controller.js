const Resident = require('../models/resident.model');
const Menu = require('../models/menu.model');
const Attendance = require('../models/Attendance.model');

exports.getDashboard = async (req,res) => {

    try {

        const today = new Date().toLocaleDateString(
            'en-CA',
            {
                timeZone:'Asia/Kolkata'
            }
        );

        const resident = await Resident.findOne({ 
          user: req.user.id, 
          isActive: true 
        })
        .sort({ createdAt: -1 })
        .populate({
          path: 'mess',
          populate: { path: 'owner', select: 'name' }
        });

        if(!resident){
            return res.status(404).json({
                success:false,
                message:'Resident not found'
            });
        }

        // Safe check for mess existence to avoid crash
        if (!resident.mess) {
            return res.status(200).json({
                success: true,
                message: "Not joined any mess",
                dashboard: {
                    residentId: resident._id,
                    mealsPurchased: 0,
                    mealsConsumed: 0,
                    mealsRemaining: 0,
                    messDetails: null,
                    todayMenu: { breakfast: 'No mess joined', dinner: 'No mess joined' },
                    todayAttendance: { morning: false, evening: false }
                }
            });
        }

        const [todayAttendance, menu] = await Promise.all([
            Attendance.findOne({ resident: resident._id, date: today }),
            Menu.findOne({ mess: resident.mess._id, date: today })
        ]);

        // Fix: Fallback to weekly schedule if no today menu override
        let finalMenu = menu;
        const messObj = resident.mess;
        
        if (!finalMenu && messObj && messObj.weeklyMenu) {
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const todayDayName = dayNames[new Date().getDay()];
            const weeklySchedule = messObj.weeklyMenu[todayDayName];
            if (weeklySchedule) {
                finalMenu = {
                    breakfast: weeklySchedule.lunch,
                    dinner: weeklySchedule.dinner,
                    isFromWeekly: true
                };
            }
        }

        const totalAttendance = await Attendance.countDocuments({
            resident: resident._id
        });

        res.status(200).json({
            success:true,
            dashboard:{
                mealsPurchased: resident.totalPurchasedMeals || 0,
                mealsConsumed: resident.mealsConsumed || 0,
                mealsRemaining: resident.mealsRemaining || 0,
                overdueMeals: resident.overdueMeals || 0,
                allowedLeaves: resident.allowedLeaves || 0,
                usedLeaves: resident.usedLeaves || 0,
                remainingLeaves: (resident.allowedLeaves || 0) - (resident.usedLeaves || 0),
                paxPlan: resident.planType,
                joiningDate: resident.joiningDate,
                isActive: resident.isActive,
                residentId: resident._id,
                todayAttendance: todayAttendance || { morning: false, evening: false },
                todayMenu: finalMenu ? {
                    breakfast: finalMenu.breakfast || finalMenu.lunch || 'No menu set',
                    dinner: finalMenu.dinner || 'No menu set',
                    isFromWeekly: finalMenu.isFromWeekly || false
                } : { breakfast: 'No menu set', dinner: 'No menu set' },
                messDetails: messObj ? {
                    name: messObj.messName || 'Your Mess',
                    address: messObj.address || 'Address not set',
                    ownerPhone: messObj.ownerPhone || 'N/A',
                    ownerName: messObj.owner?.name || 'Mess Owner',
                    upiId: messObj.upiId || ''
                } : null
            }
        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};