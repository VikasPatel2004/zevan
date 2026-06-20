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
    },

    city: {
        type: String,
        default: 'Indore'
    },

    cuisine: {
        type: String,
        enum: ['Veg', 'Non-Veg', 'Both'],
        default: 'Veg'
    },

    rating: {
        type: Number,
        default: 4.5
    },

    hygiene: {
        type: String,
        default: 'A'
    },

    description: {
        type: String,
        default: 'Homely kitchen offering fresh and hygienic meals.'
    },

    weeklyMenu: {
        Mon: { lunch: { type: String, default: '' }, dinner: { type: String, default: '' } },
        Tue: { lunch: { type: String, default: '' }, dinner: { type: String, default: '' } },
        Wed: { lunch: { type: String, default: '' }, dinner: { type: String, default: '' } },
        Thu: { lunch: { type: String, default: '' }, dinner: { type: String, default: '' } },
        Fri: { lunch: { type: String, default: '' }, dinner: { type: String, default: '' } },
        Sat: { lunch: { type: String, default: '' }, dinner: { type: String, default: '' } },
        Sun: { lunch: { type: String, default: '' }, dinner: { type: String, default: '' } },
    },

    images: {
        type: [String],
        default: []
    }

}, { timestamps: true });

module.exports = mongoose.model('Mess', messSchema);