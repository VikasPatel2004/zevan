const Menu = require('../models/menu.model');
const Mess = require('../models/mess.model');
const Resident = require('../models/resident.model');
const Activity = require('../models/activity.model');
const Notification = require('../models/notification.model');

// Update the menu if exists, if not create it
exports.updateMenu = async (req,res) => {

    try {

        const { breakfast, dinner } = req.body;

        const mess = await Mess.findOne({
            owner: req.user.id
        });

        if(!mess) {

            return res.status(404).json({
                success: false,
                message: "Mess not found"
            });

        }

        const today = new Date().toLocaleDateString('en-CA', {
            timeZone: 'Asia/Kolkata'
        });

        let menu = await Menu.findOne({

            mess: mess._id,
            date: today

        });

        if(menu) {

            menu.breakfast = breakfast;
            menu.dinner = dinner;

            await menu.save();

            // Activity
            await Activity.create({

                mess: mess._id,

                title: 'Menu Updated',

                description: 'Today menu updated'

            });

            // Notification
            await Notification.create({

                mess: mess._id,

                title: 'Menu Updated',

                description: 'Today menu updated'

            });

        } else {

            menu = await Menu.create({

                mess: mess._id,

                date: today,

                breakfast,
                dinner

            });

            // Activity
            await Activity.create({

                mess: mess._id,

                title: 'Menu Created',

                description: 'Today menu created'

            });

            // Notification
            await Notification.create({

                mess: mess._id,

                title: 'Menu Created',

                description: 'Today menu created'

            });

        }

        res.status(200).json({

            success: true,
            message: "Menu updated successfully",
            menu

        });

    } catch(error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// Resident gets today's menu
exports.getTodayMenu = async (req,res) => {

    try {

        const resident = await Resident.findOne({
            user: req.user.id
        });

        if(!resident){

            return res.status(404).json({
                success:false,
                message:"Resident not found"
            });

        }

        const today = new Date().toLocaleDateString(
            'en-CA',
            {
                timeZone: 'Asia/Kolkata'
            }
        );

        const menu = await Menu.findOne({

            mess: resident.mess,
            date: today

        });

        if(!menu) {

            return res.status(404).json({

                success: false,
                message: "Menu not found"

            });

        }

        res.status(200).json({

            success: true,
            menu

        });

    } catch(error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};