const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone_number: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'], 
    default: 'user',
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  token: {
    type: String,
  },
});

module.exports = mongoose.model('User', UserSchema);
