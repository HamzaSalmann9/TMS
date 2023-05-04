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
  signals:  [{ type : Schema.Types.ObjectId, ref: 'Signal' }],

});

module.exports = mongoose.model('Intersection', intersectionSchema);
