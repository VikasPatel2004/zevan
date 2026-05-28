const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    mess: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mess',
        required: true
    },

    planType: {
        type: String,
        enum: ['FULL', 'HALF'],
        default: 'FULL'
    },

    joiningDate: {
        type: Date,
        default: Date.now
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Resident', residentSchema);