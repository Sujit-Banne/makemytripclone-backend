const mongoose = require('mongoose');

const visaApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  visa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visa',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  applicationData: {
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    passportNumber: { type: String, required: true },
    passportExpiry: { type: Date, required: true },
    nationality: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    purpose: { type: String, required: true },
    travelDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
  },
  documents: [{
    name: { type: String },
    url: { type: String },
  }],
  adminComments: {
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

// Update the updatedAt field before saving
visaApplicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('VisaApplication', visaApplicationSchema);