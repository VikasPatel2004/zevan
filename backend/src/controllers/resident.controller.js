const Resident = require('../models/resident.model');
const Recharge = require('../models/recharge.model');
const User = require('../models/user.model');
const Attendance = require('../models/Attendance.model');

// OWNER - Get resident details
exports.getResidentDetails = async (req,res) => {

    try {

        const { residentId } = req.params;

        const resident = await Resident.findById(residentId)
            .populate('user','name email');

        if(!resident){

            return res.status(404).json({
                success:false,
                message:'Resident not found'
            });

        }

        const recharges = await Recharge.find({
            resident: residentId
        }).sort({
            createdAt: -1
        });

        const attendance = await Attendance.find({
            resident: residentId
        }).sort({
            date: -1
        });

        res.status(200).json({

            success:true,

            resident,

            rechargeCount: recharges.length,

            attendanceCount: attendance.length,

            recharges,

            attendance

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

// OWNER - Deactivate resident
exports.deactivateResident = async (req,res) => {

    try {

        const { residentId } = req.params;

        const resident = await Resident.findById(residentId);

        if(!resident){

            return res.status(404).json({

                success:false,

                message:'Resident not found'

            });

        }

        resident.isActive = false;

        await resident.save();

        res.status(200).json({

            success:true,

            message:'Resident deactivated successfully',

            resident

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};