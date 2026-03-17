const mongoose = require('mongoose');

const flightBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true,
  },
  passengers: [{
    title: { type: String, enum: ['Mr', 'Mrs', 'Ms', 'Dr'], required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    passportNumber: { type: String, required: true },
    nationality: { type: String, required: true },
  }],
  seatClass: {
    type: String,
    enum: ['economy', 'business', 'first'],
    required: true,
  },
  seats: {
    type: Number,
    required: true,
    min: 1,
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
  bookingReference: {
    type: String,
    unique: true,
  },
  specialRequests: {
    type: String,
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
flightBookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    this.bookingReference = 'FB' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FlightBooking', flightBookingSchema);