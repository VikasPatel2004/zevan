const Resident = require('../models/resident.model');
const Menu = require('../models/menu.model');
const Attendance = require('../models/Attendance.model');

exports.getDashboard = async (req,res) => {

    try {

        const resident = await Resident.findOne({
            user:req.user.id
        });

        if(!resident){

            return res.status(404).json({
                success:false,
                message:'Resident not found'
            });

        }

        const today = new Date().toLocaleDateString(
            'en-CA',
            {
                timeZone:'Asia/Kolkata'
            }
        );

        const menu = await Menu.findOne({

            mess:resident.mess,

            date:today

        });

        const attendance = await Attendance.find({

            resident:resident._id

        });

        const totalAttendance = attendance.length;

        res.status(200).json({

            success:true,

            dashboard:{

                mealsPurchased:
                    resident.totalPurchasedMeals,

                mealsConsumed:
                    resident.mealsConsumed,

                mealsRemaining:
                    resident.mealsRemaining,

                allowedLeaves:
                    resident.allowedLeaves,

                usedLeaves:
                    resident.usedLeaves,

                remainingLeaves:
                    resident.allowedLeaves -
                    resident.usedLeaves,

                attendanceCount:
                    totalAttendance,

                todayMenu:
                    menu

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