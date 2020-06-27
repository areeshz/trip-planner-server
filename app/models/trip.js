const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Trip', tripSchema)
