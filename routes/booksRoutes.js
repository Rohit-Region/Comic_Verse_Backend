const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');
const Comic = require('../models/booksModels');

// Route to get comic details by comicId
router.get('/getBook/:comicId', booksController.getBooksDetail);

// Route for liking a comic
router.post('/likes/:comicId', booksController.likeComic);

// Route for adding a comment
router.post('/comments/:comicId', booksController.addComment);

// Route for purchasing a comic
router.post('/purchase/:comicId', booksController.purchaseComic);

// Optional: Batch update route
router.post('/updates/:comicId', booksController.batchUpdate);

module.exports = router;
