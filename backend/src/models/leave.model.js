const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({

    resident:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Resident',
        required:true
    },

    mess:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Mess',
        required:true
    },

    fromDate:{
        type:Date,
        required:true
    },

    toDate:{
        type:Date,
        required:true
    },

    mealType:{
        type:String,
        enum:['MORNING','EVENING','BOTH'],
        default:'BOTH'
    },

    reason:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:['PENDING','APPROVED','REJECTED'],
        default:'PENDING'
    }

},{timestamps:true});

module.exports = mongoose.model('Leave',leaveSchema);