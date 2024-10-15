const mongoose = require('mongoose');
//const Counter = require('./path-to-your-counter-model'); // Import the Counter model

const comicSchema = new mongoose.Schema({
  comicId: {
    type: Number,
    required: true,
  },
  authorID: {
    type: Number,
 //   required: true,
  },
  comic_name: {
    type: String,
    required: true,
  },
  author_name: {
    type: String,
  },
  rating: {
    type: Number,
  },
  genre: {
    type: String,
    required: true,
  },
  comments: [
    {
      userId: { type: Number, required: true },
      name: { type: String, required: true },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  description: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
  },
  viewed: {
    type: Number,
  },
  Purchased: {
    type: Number,
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

// Middleware to auto-increment comicId before saving a new comic
comicSchema.pre('save', async function (next) {
  const comic = this;

  // Only generate a new comicId if it's not already set
  if (!comic.comicId) {
    try {
      // Find the counter document for comicId and increment it
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'comicId' }, // Use 'comicId' as the counter name
        { $inc: { sequence_value: 1 } }, // Increment the sequence value by 1
        { new: true, upsert: true } // Create the document if it doesn't exist
      );

      // Set the comicId to the incremented sequence value
      comic.comicId = counter.sequence_value;
    } catch (error) {
      return next(error);
    }
  }

  next();
});

const Comic = mongoose.model('Comic', comicSchema);

module.exports = Comic;
