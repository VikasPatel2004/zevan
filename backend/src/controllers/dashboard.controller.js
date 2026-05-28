const Attendance = require('../models/Attendance.model');

const Resident = require('../models/resident.model');

const Mess = require('../models/mess.model');

exports.getOwnerDashboard = async (req, res) => {

    try {

        const today = new Date()
            .toISOString()
            .split('T')[0];

        const mess = await Mess.findOne({
            owner: req.user.id
        });

        if (!mess) {

            return res.status(404).json({
                success: false,
                message: "Mess not found"
            });

        }

        const totalResidents = await Resident.countDocuments({

            mess: mess._id,
            isActive: true

        });

        const morningCount = await Attendance.countDocuments({

            mess: mess._id,
            date: today,
            morning: true

        });

        const eveningCount = await Attendance.countDocuments({

            mess: mess._id,
            date: today,
            evening: true

        });

        res.status(200).json({

            success: true,

            dashboard: {

                totalResidents,

                morningCount,

                eveningCount

            }

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
