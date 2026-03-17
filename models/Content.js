const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['guide', 'tip', 'review', 'story'],
    required: true,
  },
  tags: [{
    type: String,
  }],
  image: {
    type: String,
    default: '',
  },
  reads: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Content', contentSchema);
