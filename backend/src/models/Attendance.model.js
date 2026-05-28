const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({

    resident: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resident',
        required: true
    },

    mess: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mess',
        required: true
    },

    date: {
        type: String,
        required: true
    },

    morning: {
        type: Boolean,
        default: false
    },

    evening: {
        type: Boolean,
        default: false
    },

    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);