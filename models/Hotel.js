const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  amenities: [{
    type: String,
  }],
  type: {
    type: String,
    enum: ['hotel', 'resort', 'homestay', 'villa'],
    default: 'hotel',
  },
  category: {
    type: String,
    enum: ['domestic', 'international'],
    default: 'domestic',
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Hotel', hotelSchema);
