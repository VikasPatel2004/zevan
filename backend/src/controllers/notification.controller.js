const Notification =
require('../models/notification.model');

const Mess =
require('../models/mess.model');

// Get notifications
exports.getNotifications =
async (req,res)=>{

    try{

        const mess =
        await Mess.findOne({

            owner:req.user.id

        });

        if(!mess){

            return res.status(404).json({

                success:false,

                message:'Mess not found'

            });

        }

        const notifications =
        await Notification.find({

            mess:mess._id

        })

        .sort({

            createdAt:-1

        })

        .limit(20);

        res.status(200).json({

            success:true,

            notifications

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

// Mark notification as read
exports.markAsRead =
async (req,res)=>{

    try{

        const { id } = req.params;

        const notification =
        await Notification.findById(id);

        if(!notification){

            return res.status(404).json({

                success:false,

                message:'Notification not found'

            });

        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({

            success:true,

            message:'Notification marked as read',

            notification

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};