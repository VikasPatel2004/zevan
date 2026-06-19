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

// Owner or Resident gets the full weekly menu
exports.getWeeklyMenu = async (req, res) => {
    try {
        let messId;
        
        if (req.user.role === 'OWNER') {
            const mess = await Mess.findOne({ owner: req.user.id });
            if (!mess) return res.status(404).json({ success: false, message: "Mess not found" });
            messId = mess._id;
        } else {
            const resident = await Resident.findOne({ user: req.user.id });
            if (!resident) return res.status(404).json({ success: false, message: "Resident not found" });
            messId = resident.mess;
        }

        const mess = await Mess.findById(messId);
        if (!mess) return res.status(404).json({ success: false, message: "Mess not found" });
        
        res.status(200).json({ success: true, weeklyMenu: mess.weeklyMenu });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Owner updates the full weekly menu
exports.updateWeeklyMenu = async (req, res) => {
    try {
        const { weeklyMenu } = req.body;
        const mess = await Mess.findOneAndUpdate(
            { owner: req.user.id },
            { weeklyMenu },
            { new: true }
        );
        if (!mess) {
            return res.status(404).json({ success: false, message: "Mess not found" });
        }
        res.status(200).json({ success: true, message: "Weekly menu updated", weeklyMenu: mess.weeklyMenu });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Resident gets today's menu (with fallback to weekly schedule)
exports.getResidentTodayMenu = async (req, res) => {
    try {
        const resident = await Resident.findOne({ user: req.user.id }).populate('mess');
        if (!resident) {
            return res.status(404).json({ success: false, message: "Resident not found" });
        }

        const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const todayDayName = dayNames[new Date().getDay()];

        // Check if there is a specific menu for today
        let menu = await Menu.findOne({ mess: resident.mess._id, date: todayDate });
        
        if (!menu) {
            // Fallback to the mess's weekly schedule for today
            const weeklySchedule = resident.mess.weeklyMenu?.[todayDayName];
            if (weeklySchedule) {
                menu = {
                    breakfast: weeklySchedule.lunch,
                    dinner: weeklySchedule.dinner,
                    isFromWeekly: true
                };
            }
        }

        res.status(200).json({
            success: true,
            menu: menu || { breakfast: 'No menu set', dinner: 'No menu set' }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};