const mongoose = require('mongoose');

const visaSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  visaType: {
    type: String,
    required: true,
  },
  processingTime: {
    type: String,
    required: true,
  },
  fee: {
    type: String,
    required: true,
  },
  requirements: [{
    type: String,
  }],
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: ['tourist', 'business', 'student', 'work', 'medical'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Visa', visaSchema);
