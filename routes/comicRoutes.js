const express = require('express');
const multer = require('multer');
const path = require('path');
const comicController = require('../controllers/comicController');
const Comic = require('../models/comicModel');
const router = express.Router();

// Configure multer to store files locally

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/'); // Ensure this folder exists
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     }
//   });

// const upload = multer({ storage });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize multer with the storage
const upload = multer({ storage: storage });

// router.post('/upload', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), (req, res) => {
//     if (!req.files) {
//       return res.status(400).send({ message: 'No files were uploaded.' });
//     }
//     console.log("Request received:", req.body);
//     console.log("Files:", req.files);
//     // Handle your file processing here
//   });

router.post('/upload', (req, res) => {
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
        pdf: {
          originalname: req.files.pdf[0].originalname,
          filename: req.files.pdf[0].filename,
          mimetype: req.files.pdf[0].mimetype,
          destination: req.files.pdf[0].destination,
          size: req.files.pdf[0].size
        }
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


router.get('/comics/:comic_id', async (req, res) => {
  try {
    const comic = await Comic.findOne({ comic_id: req.params.comic_id });
    if (!comic) {
      return res.status(404).json({ message: "Comic not found" });
    }
    res.status(200).json(comic);
  } catch (error) {
    console.error("Error fetching comic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// GET route to serve uploaded files
router.get('/uploads/:filename', comicController.serveUploads);

module.exports = router;
