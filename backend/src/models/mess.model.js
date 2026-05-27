const mongoose = require('mongoose');

const messSchema = new mongoose.Schema({

    messName: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    upiId: {
        type: String,
        required: true
    },

    ownerPhone: {
        type: String,
        required: true
    },

    monthlyPrice: {
        type: Number,
        required: true
    },

    rules: {
        type: String
    },

    joinCode: {
        type: String,
        unique: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true });

module.exports = mongoose.model('Mess', messSchema);