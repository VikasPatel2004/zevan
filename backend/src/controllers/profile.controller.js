const User = require('../models/user.model');
const Resident = require('../models/resident.model');
const Mess = require('../models/mess.model');

exports.getProfile = async (req,res) => {

    try {

        const user = await User.findById(req.user.id)
        .select('-password');

        if(!user){

            return res.status(404).json({
                success:false,
                message:'User not found'
            });

        }

        let profileData = {};

        if(user.role === 'RESIDENT'){

            const resident = await Resident.findOne({
                user:user._id
            });

            profileData = resident;

        }

        if(user.role === 'OWNER'){

            const mess = await Mess.findOne({
                owner:user._id
            });

            profileData = mess;

        }

        res.status(200).json({

            success:true,

            user,

            profileData

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

// this is done to update or edit your profile
exports.updateProfile = async (req,res) => {

    try {

        const { name } = req.body;

        const user = await User.findById(req.user.id);

        if(!user){

            return res.status(404).json({
                success:false,
                message:'User not found'
            });

        }

        user.name = name;

        await user.save();

        res.status(200).json({

            success:true,

            message:'Profile updated',

            user

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};