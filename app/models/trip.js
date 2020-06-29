const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
  title: {
    // required: true,
    type: String
  },
  destination: {
    // required: true,
    type: String
  },
  duration: {
    // required: true,
    type: Number
  },
  date: {
    // required: true,
    type: String
  },
  budget: {
    // required: true,
    type: Number
  },
  category: {
    // required: true,
    type: String
  },
  status: {
    // required: true,
    type: String
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
