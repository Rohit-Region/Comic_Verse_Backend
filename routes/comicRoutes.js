const express = require('express');
const multer = require('multer');
const path = require('path');
const comicController = require('../controllers/comicController');
const Comic = require('../models/comicModel');
const router = express.Router();
const Counter = require('../models/counterModel'); 



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

      const counter = await Counter.findByIdAndUpdate(
        { _id: 'comicId' }, // Use 'comicId' as the counter name
        { $inc: { sequence_value: 1 } }, // Increment the sequence value by 1
        { new: true, upsert: true } // Create the document if it doesn't exist
      );

      const comicId = counter.sequence_value;

      // Ensure image and pdf were uploaded
      if (!req.files || !req.files.image || !req.files.pdf) {
        return res.status(400).send({ message: 'Both image and PDF files are required.' });
      }

     console.log("files",req.body)
    //  let comments = req.body.comments;
    //  if (typeof comments === 'string') {
    //    comments = JSON.parse(comments); 
    //  }
     let comicData = {
        comicId: comicId,
        authorID:req.body.authorID,
        comic_name: req.body.comic_name,
        author_name:req.body.author_name,
        genre: req.body.genre,
        description:req.body.description,
        likes:req.body.likes,
        comment:[],
        rating:req.body.rating,
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
      console.log("Comic Details : ",comic)
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

// Edit a comic by comicId
router.put('/uploads/:comicId', async (req, res) => {
  
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }])(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).send('Multer error');
    }
    
    try {
      const comicId = req.params.comicId;
    //     console.log("comicId : ",comicId)
    //  console.log("files",req.body)
     let comicData = {
        comicId:req.body.comicId,
        comic_name: req.body.comic_name,
        author_name:req.body.author_name,
        genre: req.body.genre,
        description:req.body.description,
        likes:req.body.likes,
        comment:[],
        rating:req.body.rating,
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
      // console.log("Comic Details : ",comic)
      // Save the comic to the database using async/await
      const savedComic = await comic.save();
  
  // try {
  //   const comicId = req.params.comicId;
  //   console.log(comicId)
  //   console.log(req.body)
  //   // Find the comic by comicId and update its fields
  //   const updatedComic = await Comic.findOneAndUpdate(
  //     { comicId: comicId }, // Find comic by comicId
  //     req.body,              // Update with new data from request body
  //     { new: true }          // Return the updated document
  //   );

    if (!savedComic) {
      return res.status(404).json({ message: "Comic not found" });
    }

    res.status(200).json({
      message: "Comic updated successfully",
      comic: savedComic
    });
  } catch (error) {
    console.error("Error updating comic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
});

// Delete a comic by comicId
router.delete('/comics/:comicId', async (req, res) => {
  try {
    const comicId = req.params.comicId;

    // Find the comic by comicId and delete it
    const deletedComic = await Comic.findOneAndDelete({ comicId: comicId });

    if (!deletedComic) {
      return res.status(404).json({ message: "Comic not found" });
    }

    res.status(200).json({
      message: "Comic deleted successfully",
      comic: deletedComic
    });
  } catch (error) {
    console.error("Error deleting comic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get('/comics', async (req, res) => {
  try {
    const comics = await Comic.find(); // Retrieve all comics from the database
    res.status(200).json(comics); // Send all comic details as a response
  } catch (error) {
    console.error("Error fetching comics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/comicsTop', async (req, res) => {
  try {
    const comics = await Comic.find(); // Retrieve all comics from the database
    res.status(200).json(comics); // Send all comic details as a response
  } catch (error) {
    console.error("Error fetching comics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get('/comics/:comicId', async (req, res) => {
  try {
    const comic = await Comic.findOne({ comicId: req.params.comicId });
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
