const Notification =
require('../models/notification.model');

const Mess =
require('../models/mess.model');

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