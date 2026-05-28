const Resident = require('../models/resident.model');
const Attendance = require('../models/Attendance.model');

exports.markAttendance = async (req, res) => {

    try {

        const {
            residentId,
            morning,
            evening
        } = req.body;

        const resident = await Resident.findById(residentId);

        if (!resident) {

            return res.status(404).json({
                success: false,
                message: "Resident not found"
            });

        }

        const today = new Date()
            .toISOString()
            .split('T')[0];

        let attendance = await Attendance.findOne({

            resident: residentId,
            date: today

        });

        if (attendance) {

            attendance.morning = morning;
            attendance.evening = evening;

            await attendance.save();

        } else {

            attendance = await Attendance.create({

                resident: residentId,

                mess: resident.mess,

                date: today,

                morning,
                evening,

                markedBy: req.user.id

            });

        }

        res.status(200).json({
            success: true,
            message: "Attendance marked successfully",
            attendance
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};