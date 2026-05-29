const Resident = require('../models/resident.model');
const Attendance = require('../models/Attendance.model');
const Leave = require('../models/leave.model');
const Recharge = require('../models/recharge.model');
const Mess = require('../models/mess.model');

exports.getOwnerDashboard = async (req,res) => {

    try {

        const mess = await Mess.findOne({
            owner:req.user.id
        });

        if(!mess){

            return res.status(404).json({
                success:false,
                message:'Mess not found'
            });

        }

        const today = new Date().toLocaleDateString(
            'en-CA',
            {
                timeZone:'Asia/Kolkata'
            }
        );

        const totalResidents =
            await Resident.countDocuments({
                mess:mess._id,
                isActive:true
            });

        const morningCount =
            await Attendance.countDocuments({
                mess:mess._id,
                date:today,
                morning:true
            });

        const eveningCount =
            await Attendance.countDocuments({
                mess:mess._id,
                date:today,
                evening:true
            });

        const pendingLeaves =
            await Leave.countDocuments({
                mess:mess._id,
                status:'PENDING'
            });

        const recharges =
            await Recharge.find()
            .populate({
                path:'resident',
                match:{ mess:mess._id }
            });

        let revenue = 0;

        recharges.forEach((r)=>{

            if(r.resident){
                revenue += r.amountPaid;
            }

        });

        res.status(200).json({

            success:true,

            dashboard:{

                totalResidents,

                morningCount,

                eveningCount,

                pendingLeaves,

                totalRevenue:revenue

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