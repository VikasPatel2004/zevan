const Mess = require('../models/mess.model');

exports.createMess = async (req,res) => {

    try {

        const {
            messName,
            address,
            upiId,
            ownerPhone,
            monthlyPrice,
            rules
        } = req.body;

        // generating the join code for the mess 
        const joinCode = Math.random()
            .toString(36)
            .substring(2,8)
            .toUpperCase();

        const mess = await Mess.create({

            messName,
            address,
            upiId,
            ownerPhone,
            monthlyPrice,
            rules,

            joinCode,

            owner: req.user.id  //this id is coming from the auth middleware

        });

        res.status(201).json({
            success: true,
            message: "Mess created successfully",
            mess
        });

    } catch(error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};