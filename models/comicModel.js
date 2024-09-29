const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
  comic_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  image: {
    type: {
      originalname: { type: String },
      filename: { type: String },
      mimetype: { type: String },
      destination: { type: String },
      path: { type: String },
    },
    required: true,
  },
  pdf: {
    type: {
      originalname: { type: String },
      filename: { type: String },
      mimetype: { type: String },
      destination: { type: String },
      path: { type: String },
    },
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Comic = mongoose.model('Comic', comicSchema);

module.exports = Comic;
