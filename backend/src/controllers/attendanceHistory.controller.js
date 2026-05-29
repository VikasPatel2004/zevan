const Attendance =
require('../models/Attendance.model');

const Resident =
require('../models/resident.model');

exports.getMyAttendance =
async (req,res) => {

    try {

        const resident =
        await Resident.findOne({

            user:req.user.id

        });

        if(!resident){

            return res.status(404).json({

                success:false,

                message:'Resident not found'

            });

        }

        const attendance =
        await Attendance.find({

            resident:resident._id

        })

        .sort({

            date:-1

        });

        res.status(200).json({

            success:true,

            totalRecords:
                attendance.length,

            attendance

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};