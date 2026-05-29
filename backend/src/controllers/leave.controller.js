const Leave = require('../models/leave.model');
const Resident = require('../models/resident.model');

// this is for resident to apply for leave 
exports.applyLeave = async (req,res) => {

    try {

        const {
            fromDate,
            toDate,
            mealType,
            reason
        } = req.body;

        const resident = await Resident.findOne({
            user:req.user.id
        });

        if(!resident){

            return res.status(404).json({
                success:false,
                message:'Resident not found'
            });

        }

        const leave = await Leave.create({

            resident:resident._id,

            mess:resident.mess,

            fromDate,

            toDate,

            mealType,

            reason

        });

        res.status(201).json({

            success:true,

            message:'Leave request submitted',

            leave

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

//approved leaves by the owner only 

exports.approveLeave = async (req,res) => {

    try {

        const { leaveId } = req.params;

        const leave = await Leave.findById(leaveId)
            .populate('resident');

        if(!leave){

            return res.status(404).json({

                success:false,

                message:'Leave not found'

            });

        }

        leave.status = 'APPROVED';

        await leave.save();

        const resident =
            await Resident.findById(
                leave.resident._id
            );

        resident.usedLeaves += 1;

        await resident.save();

        res.status(200).json({

            success:true,

            message:'Leave approved'

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};