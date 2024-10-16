const mongoose = require('mongoose');

const authorModels = new mongoose.Schema({
      authorId: {
        type: Number,
        required: true,
      },
      comicId: {
        type: Number,
        required: true,
      },
      comic_name: {
        type: String,
        // required: true,
      },
    
})

const Comic = mongoose.models.Comic || mongoose.model('author', authorModels);
module.exports = Comic