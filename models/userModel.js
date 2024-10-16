const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true, // This ensures each user has a unique userId
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: Number,
  },
  role: {
    type: String,
    enum: ['admin', 'author', 'user'], 
    default: 'user',
  },
  authorId: {
    type: Number,
    // unique: true, // Uncomment if each authorId should also be unique
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

// Pre-save hook to automatically set authorId if the role is 'author'
UserSchema.pre('save', function(next) {
  if (this.role === 'author' && this.userId) {
    this.authorId = parseInt(`999${this.userId}`, 10);
  } else {
    // Clear authorId if not an author or userId is not defined
    this.authorId = undefined;
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
