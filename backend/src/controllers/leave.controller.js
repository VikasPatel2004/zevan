const Leave = require('../models/leave.model');
const Resident = require('../models/resident.model');
const User = require('../models/user.model');
const Activity = require('../models/activity.model');
const Notification = require('../models/notification.model');

// Resident applies for leave
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

        const user = await User.findById(req.user.id);

        // Activity
        await Activity.create({

            mess: resident.mess,

            title: 'Leave Request',

            description: `${user.name} applied for leave`

        });

        // Notification
        await Notification.create({

            mess: resident.mess,

            title: 'Leave Request',

            description: `${user.name} applied for leave`

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

// Owner approves leave
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

        if(leave.status === 'APPROVED'){

            return res.status(400).json({

                success:false,

                message:'Leave already approved'

            });

        }

        leave.status = 'APPROVED';

        await leave.save();

        const resident = await Resident.findById(
            leave.resident._id
        );

        resident.usedLeaves += 1;

        await resident.save();

        const residentUser = await User.findById(
            resident.user
        );

        // Activity
        await Activity.create({

            mess: resident.mess,

            title: 'Leave Approved',

            description:
                `${residentUser.name}'s leave was approved`

        });

        // Notification
        await Notification.create({

            mess: resident.mess,

            title: 'Leave Approved',

            description:
                `${residentUser.name}'s leave was approved`

        });

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