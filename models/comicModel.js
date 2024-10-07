const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
  comic_id: {
    type: Number,
    required: true,
  },
  comic_name: {
    type: String,
    required: true,
  },
  auhtor_name: {
    type: String,
    required: false,
  },
  // rating: {
  //   type: Number,
  //   required: true,
  // },
  genre: {
    type: String,
    required: true,
  },
  description: {
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
  },
  pdf: {
    type: {
      originalname: { type: String },
      filename: { type: String },
      mimetype: { type: String },
      destination: { type: String },
      path: { type: String },
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Comic = mongoose.model('Comic', comicSchema);

module.exports = Comic;
