const express  = require('express')
const multer = require('multer')
const path = require('path');
const booksController = require('../controllers/booksController')
const Comic = require('../models/booksModels')
const router=express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  const upload = multer({ storage: storage });

  router.post('/uploadBooks', (req, res) => {
    upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }])(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(500).send('Multer error');
      }
      
      try {
       console.log("files",req.body)
        let comicData = {
          comic_id:req.body.comic_id,
          comic_name: req.body.comic_name,
          author_name:req.body.author_name,
          genre: req.body.genre,
          description:req.body.description,
          image: {
            originalname: req.files.image[0].originalname,
            filename: req.files.image[0].filename,
            mimetype: req.files.image[0].mimetype,
            destination: req.files.pdf[0].destination,
            path: req.files.image[0].path
          },
              };
     
        const comic = new Comic(comicData);
  
        // Save the comic to the database using async/await
        const savedComic = await comic.save();
        
        // Send a response after saving
        res.status(200).json({
          message: 'File uploaded and comic saved successfully',
          comic: savedComic
        });
      } catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).send("Internal server error");
      }
    });
  });