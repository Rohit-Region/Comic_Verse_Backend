const mongoose = require('mongoose');

// Schema for counter
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },  // This will store the name of the counter (e.g., 'userId')
  sequence_value: { type: Number, required: true }  // The incrementing value
});

// Create model for the counter
const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
