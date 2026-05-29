const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    mess:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Mess',
        required:true
    },

    planType:{
        type:String,
        enum:['FULL','HALF'],
        default:'FULL'
    },

    joiningDate:{
        type:Date,
        default:Date.now
    },

    isActive:{
        type:Boolean,
        default:true
    },

    totalPurchasedMeals:{
        type:Number,
        default:0
    },

    mealsConsumed:{
        type:Number,
        default:0
    },

    mealsRemaining:{
        type:Number,
        default:0
    }

},{timestamps:true});

module.exports = mongoose.model('Resident', residentSchema);