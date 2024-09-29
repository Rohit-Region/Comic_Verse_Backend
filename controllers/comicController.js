const Comic = require('../models/comicModel');

// Handle file uploads and save comic details to the database
// exports.uploadComic = (req, res) => {
//   try {
//       console.log("Request received:", req.body);
//       console.log("Files:", req.files);
//       console.log("Cracked");

//       // Send a simple response to check if this part is hit
//       res.status(200).json({
//           message: 'Request successfully received, file processing underway...'
//       });

//       // Continue file processing logic after sending the response
//       const { name, rating, genre } = req.body;
//       const imagePath = req.files['image'] ? req.files['image'][0].path : null;
//       const pdfPath = req.files['pdf'] ? req.files['pdf'][0].path : null;

//       console.log("imagePath:", imagePath);
//       console.log("pdfPath:", pdfPath);
//   } catch (error) {
//       console.error("Error during file upload:", error);
//       res.status(500).send("Internal server error");
//   }
// };



  

// Serve uploaded files
exports.serveUploads = (req, res) => {
  console.log("data",res)
  res.sendFile(path.join(__dirname, '..', 'uploads', req.params.filename));
};
