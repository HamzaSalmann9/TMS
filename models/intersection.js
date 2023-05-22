const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Signal = require('./signal');

const intersectionSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  location: {
    lat: {
      required: true,
      type: Number,
    },
    long: {
      required: true,
      type: Number,
    },
  },
  signals:  [
    {
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
  },
],
},
);

module.exports = mongoose.model('Intersection', intersectionSchema);
