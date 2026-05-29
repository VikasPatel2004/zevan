const Rating = require('../models/rating.model');
const Resident = require('../models/resident.model');

// this is done by the resident only 
exports.submitRating = async (req,res) => {

    try {

        const { rating, review } = req.body;

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

        const existingRating =
        await Rating.findOne({

            resident:resident._id,

            date:today

        });

        if(existingRating){

            return res.status(400).json({

                success:false,

                message:'You already rated today'

            });

        }

        const newRating =
        await Rating.create({

            resident:resident._id,

            mess:resident.mess,

            date:today,

            rating,

            review

        });

        res.status(201).json({

            success:true,

            message:'Rating submitted',

            rating:newRating

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

// this is done by the owner only 
exports.getMessRatings = async (req,res) => {

    try {

        const ratings =
        await Rating.find()

        .populate({

            path:'resident',

            populate:{
                path:'user',
                select:'name'
            }

        })

        .sort({
            createdAt:-1
        });

        res.status(200).json({

            success:true,

            totalRatings:
                ratings.length,

            ratings

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};