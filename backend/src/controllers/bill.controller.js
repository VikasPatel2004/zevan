const Bill = require('../models/bill.model');

const Attendance = require('../models/Attendance.model');

const Resident = require('../models/resident.model');

const Mess = require('../models/mess.model');

exports.generateBill = async (req,res) => {

    try {

        const { residentId } = req.body;

        const resident = await Resident.findById(residentId);

        if(!resident){

            return res.status(404).json({
                success:false,
                message:"Resident not found"
            });

        }

        const mess = await Mess.findById(resident.mess);

        const now = new Date();

        const month = now.getMonth() + 1;

        const year = now.getFullYear();

        const attendanceRecords = await Attendance.find({

            resident: residentId

        });

        let totalMeals = 0;

        attendanceRecords.forEach((record) => {

            if(record.morning){
                totalMeals++;
            }

            if(record.evening){
                totalMeals++;
            }

        });

        const perMealPrice = mess.monthlyPrice / 60;

        const totalAmount = totalMeals * perMealPrice;

        const existingBill = await Bill.findOne({

            resident: residentId,
            month,
            year

        });

        if(existingBill){

            return res.status(400).json({
                success:false,
                message:"Bill already generated"
            });

        }

        const bill = await Bill.create({

            resident: residentId,

            mess: resident.mess,

            month,
            year,

            totalMeals,

            totalAmount

        });

        res.status(201).json({

            success:true,
            message:"Bill generated successfully",

            bill

        });

    } catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};