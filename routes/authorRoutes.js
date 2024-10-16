const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const Comic = require('../models/authorModel');

// Route to get comic details by comicId
// router.get('/authorbooks/:authorId', authorController.getAuthorDetail);


module.exports = router;
