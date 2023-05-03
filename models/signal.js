const mongoose = require('mongoose');


const signalSchema = new mongoose.Schema({
    _id:{
        required: true,
        type:Number,
    },
    location:{
        lat:{
            required: true,
            type:Number,
        },
        long:{
            required: true,
            type:Number,
        },
        stream_link:{
            required: true,
            type:String,
        },
    }
});
module.exports = mongoose.model('Signal',signalSchema);