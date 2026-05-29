const Mess = require('../models/mess.model');
const Resident = require('../models/resident.model');
const User = require('../models/user.model');
const Activity = require('../models/activity.model');
const Notification = require('../models/notification.model');

// creating the mess this is done by the owner only
exports.createMess = async (req, res) => {

    try {

        const {
            messName,
            address,
            upiId,
            ownerPhone,
            monthlyPrice,
            rules
        } = req.body;

        const joinCode = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

        const mess = await Mess.create({

            messName,
            address,
            upiId,
            ownerPhone,
            monthlyPrice,
            rules,
            joinCode,
            owner: req.user.id

        });

        // Activity
        await Activity.create({

            mess: mess._id,

            title: 'Mess Created',

            description: `${messName} mess was created`

        });

        // Notification
        await Notification.create({

            mess: mess._id,

            title: 'Mess Created',

            description: `${messName} mess was created`

        });

        res.status(201).json({

            success: true,

            message: "Mess created successfully",

            mess

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// joining the mess this is done by the resident only
exports.joinMess = async (req, res) => {

    try {

        const { joinCode } = req.body;

        const mess = await Mess.findOne({ joinCode });

        if (!mess) {

            return res.status(404).json({

                success: false,

                message: "Invalid join code"

            });

        }

        const existingResident = await Resident.findOne({

            user: req.user.id,

            mess: mess._id

        });

        if (existingResident) {

            return res.status(400).json({

                success: false,

                message: "Already joined this mess"

            });

        }

        const resident = await Resident.create({

            user: req.user.id,

            mess: mess._id,

            planType: 'FULL',

            totalPurchasedMeals: 0,

            mealsConsumed: 0,

            mealsRemaining: 0,

            allowedLeaves: 10,

            usedLeaves: 0

        });

        const user = await User.findById(req.user.id);

        // Activity
        await Activity.create({

            mess: mess._id,

            title: 'New Resident Joined',

            description: `${user.name} joined the mess`

        });

        // Notification
        await Notification.create({

            mess: mess._id,

            title: 'New Resident Joined',

            description: `${user.name} joined the mess`

        });

        res.status(201).json({

            success: true,

            message: "Joined mess successfully",

            resident

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};