const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({

    mess:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Mess',
        required:true
    },

    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    isRead:{
        type:Boolean,
        default:false
    }

},{timestamps:true});

module.exports =
mongoose.model(
    'Notification',
    notificationSchema
);