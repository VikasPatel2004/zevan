const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({

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

    date:{
        type:String,
        required:true
    },

    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },

    review:{
        type:String,
        default:''
    }

},{timestamps:true});

module.exports =
mongoose.model('Rating',ratingSchema);