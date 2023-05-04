const mongoose = require('mongoose');


const signalSchema = new mongoose.Schema({
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