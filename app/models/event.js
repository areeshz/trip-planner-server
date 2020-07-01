const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = eventSchema
