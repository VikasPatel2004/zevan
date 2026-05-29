const Recharge = require('../models/recharge.model');
const Resident = require('../models/resident.model');

exports.getMyRechargeHistory = async (req,res) => {

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

        const recharges = await Recharge.find({

            resident:resident._id

        }).sort({

            createdAt:-1

        });

        res.status(200).json({

            success:true,

            totalRecharges:recharges.length,

            recharges

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

exports.getMessPayments = async (req,res) => {

    try {

        const recharges = await Recharge.find()

        .populate({

            path:'resident',

            populate:{

                path:'user',

                select:'name email'

            }

        })

        .sort({

            createdAt:-1

        });

        res.status(200).json({

            success:true,

            totalPayments:recharges.length,

            recharges

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};