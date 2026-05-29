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

        const today = new Date().toLocaleDateString('en-CA', {
            timeZone: 'Asia/Kolkata'
        });

        let attendance = await Attendance.findOne({

            resident: residentId,
            date: today

        });

        let mealsToDeduct = 0;

        if (attendance) {

            // Morning deduction
            if (!attendance.morning && morning) {
                mealsToDeduct += 1;
            }

            // Evening deduction
            if (!attendance.evening && evening) {
                mealsToDeduct += 1;
            }

            attendance.morning = morning;
            attendance.evening = evening;

            await attendance.save();

        } else {

            if (morning) mealsToDeduct += 1;
            if (evening) mealsToDeduct += 1;

            attendance = await Attendance.create({

                resident: residentId,

                mess: resident.mess,

                date: today,

                morning,
                evening,

                markedBy: req.user.id

            });

        }

        // Wallet Update
        if (mealsToDeduct > 0) {

            if (resident.mealsRemaining < mealsToDeduct) {

                return res.status(400).json({

                    success: false,

                    message: "Insufficient meal balance"

                });

            }

            resident.mealsConsumed += mealsToDeduct;

            resident.mealsRemaining -= mealsToDeduct;

            await resident.save();

        }

        res.status(200).json({

            success: true,

            message: "Attendance marked successfully",

            attendance,

            wallet: {

                totalPurchasedMeals:
                    resident.totalPurchasedMeals,

                mealsConsumed:
                    resident.mealsConsumed,

                mealsRemaining:
                    resident.mealsRemaining

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};