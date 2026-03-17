const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  highlights: [{
    type: String,
  }],
  bestTime: {
    type: String,
  },
  category: {
    type: String,
    enum: ['international', 'domestic'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Destination', destinationSchema);
