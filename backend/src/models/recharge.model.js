const mongoose = require('mongoose');

const rechargeSchema = new mongoose.Schema({
    resident: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resident',
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    mealsAdded: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Recharge', rechargeSchema);