const mongoose = require('mongoose');

const booksModels = new mongoose.Schema({
    comic_id:{
        type:Number,
        required:true,
    },
    comic_name:{
        type:String,
        required:true,
    },
    comic_rating:{
        type:String,
    },
    comic_episodes:{
        type:String,
    },
    comic_reviews:{
        type:String,
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
      },
    
})

const Comic = mongoose.model('Comic',booksModels)
module.exports = Comic