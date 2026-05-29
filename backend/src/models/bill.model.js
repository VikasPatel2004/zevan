const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({

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

    month: {
        type: Number,
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    totalMeals: {
        type: Number,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    paid: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);