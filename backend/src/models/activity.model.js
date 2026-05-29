const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({

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
    }

},{timestamps:true});

module.exports =
mongoose.model('Activity',activitySchema);