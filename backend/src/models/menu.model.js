const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({

    mess: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mess',
        required: true
    },

    date: {
        type: String,
        required: true
    },

    breakfast: {
        type: String,
        required: true
    },

    dinner: {
        type: String,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);