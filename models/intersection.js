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
        
    },
    stream_link:{
        required: true,
        type:String,
    },
});

const intersectionSchema = new mongoose.Schema({
    name:{
        required: true,
        type:String
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
    },
    signals:[signalSchema]
});


module.exports = mongoose.model('Intersection', intersectionSchema);
