const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true,
  },
  airline: {
    type: String,
    required: true,
  },
  departure: {
    airport: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  arrival: {
    airport: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  duration: {
    type: String,
    required: true,
  },
  aircraft: {
    type: String,
    required: true,
  },
  seats: {
    economy: {
      total: { type: Number, default: 150 },
      available: { type: Number, default: 150 },
      price: { type: Number, required: true },
    },
    business: {
      total: { type: Number, default: 20 },
      available: { type: Number, default: 20 },
      price: { type: Number, required: true },
    },
    first: {
      total: { type: Number, default: 10 },
      available: { type: Number, default: 10 },
      price: { type: Number, required: true },
    },
  },
  status: {
    type: String,
    enum: ['scheduled', 'delayed', 'cancelled', 'departed', 'arrived'],
    default: 'scheduled',
  },
  category: {
    type: String,
    enum: ['domestic', 'international'],
    default: 'international',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Flight', flightSchema);