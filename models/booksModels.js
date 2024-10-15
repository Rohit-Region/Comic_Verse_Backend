const mongoose = require('mongoose');

const booksModels = new mongoose.Schema({
    comicId: {
        type: Number,
        required: true,
      },
      rating: {
        type: Number,
      },
      comments: [
        {
          userId: { type: Number, required: true },
          name: { type: String, required: true },
          comment: { type: String, required: true },
          date: { type: Date, default: Date.now },
        },
      ],
    
      likes: {
        type: Number,
      },
      viewed: {
        type: Number,
      },
      Purchased: {
        type: Number,
      },
    
})

const Comic = mongoose.models.Comic || mongoose.model('Comic', booksModels);
module.exports = Comic