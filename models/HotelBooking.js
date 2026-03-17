const mongoose = require('mongoose');

const hotelBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  guests: {
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0 },
  },
  roomType: {
    type: String,
    enum: ['single', 'double', 'suite', 'deluxe'],
    default: 'single',
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  specialRequests: {
    type: String,
  },
  bookingReference: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate booking reference before saving
hotelBookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    this.bookingReference = 'HB' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HotelBooking', hotelBookingSchema);