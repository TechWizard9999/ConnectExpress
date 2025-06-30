const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  trainNo: {
    type: String,
    required: true,
  },
  trainName: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  arrivalTime: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    enum: ['Available', 'Full'],
    required: true,
  },
  riskFactor: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
});

module.exports = mongoose.model('Train', trainSchema);x