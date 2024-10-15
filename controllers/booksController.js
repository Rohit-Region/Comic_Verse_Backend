const Comic = require('../models/booksModels');

// Function to get comic details by comicId
exports.getBooksDetail = async (req, res) => {
    try {
      const { comicId } = req.params;
      console.log("ComicID",comicId)
      const comic = await Comic.findOne({ comicId });
  
      if (!comic) {
        return res.status(404).json({ message: 'Comic not found' });
      }
  
      res.status(200).json({
        message: 'Comic details retrieved successfully',
        comicId: comic.comicId,         // Include comicId for clarity
        comic_name: comic.comic_name,    // Include comic_name explicitly         // You can include other fields if needed
        comments: comic.comments,
        likes: comic.likes,
        viewed: comic.viewed,
        purchased: comic.Purchased,
        // Add any other fields you want to include in the response
      });
    } catch (error) {
      console.error('Error retrieving comic details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
// Function to update likes and reviews for a comic
// Like a comic
exports.likeComic = async (req, res) => {
    try {
      const { comicId } = req.params;
      const comic = await Comic.findOneAndUpdate(
        { comicId },
        { $inc: { likes: 1 } },
        { new: true }
      );
  
      if (!comic) {
        return res.status(404).json({ message: 'Comic not found' });
      }
  
      res.status(200).json({
        message: 'Comic liked successfully',
        comicId: comic.comicId,         // Include comicId for clarity
        comic_name: comic.comic_name,    // Include comic_name explicitly
        likes: comic.likes,
      });
    } catch (error) {
      console.error('Error liking comic:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Add a comment to a comic
  exports.addComment = async (req, res) => {
    try {
      const { comicId } = req.params;
      const { userId, name, comment } = req.body; // Expecting { userId: 1, name: 'User Name', comment: 'Your comment here' }
  
      // Create a new comment object
      const newComment = {
        userId,
        name,
        comment,
        date: new Date(), // Automatically set the current date
      };
  
      // Find the comic and ensure comments is an array
      const comic = await Comic.findOne({ comicId });
  
      if (!comic) {
        return res.status(404).json({ message: 'Comic not found' });
      }
  
      // If comments is null or undefined, initialize it as an empty array
      if (!comic.comments) {
        comic.comments = [];
      }
  
      // Add the new comment to the comments array
      comic.comments.push(newComment);
  
      // Save the updated comic
      const updatedComic = await comic.save();
  
      res.status(200).json({
        message: 'Comment added successfully',
        comic: updatedComic,
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  

  
  
  
  
  // Purchase a comic
  exports.purchaseComic = async (req, res) => {
    try {
      const { comicId } = req.params;
  
      const comic = await Comic.findOneAndUpdate(
        { comicId },
        { $inc: { Purchased: 1 } },
        { new: true }
      );
  
      if (!comic) {
        return res.status(404).json({ message: 'Comic not found' });
      }
  
      res.status(200).json({
        message: 'Comic purchased successfully',
        comic
      });
    } catch (error) {
      console.error('Error purchasing comic:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Batch update for likes, comments, and purchases
  exports.batchUpdate = async (req, res) => {
    try {
      const { comicId } = req.params;
      const { like, comment, purchase } = req.body; // Expecting { like: true, comment: 'Your comment', purchase: true }
  
      const updateData = {};
      if (like) updateData.likes = (await Comic.findOne({ comicId })).likes + 1;
      if (comment) updateData.comments = (await Comic.findOne({ comicId })).comments.concat(comment);
      if (purchase) updateData.Purchased = (await Comic.findOne({ comicId })).Purchased + 1;
  
      const comic = await Comic.findOneAndUpdate(
        { comicId },
        { $set: updateData },
        { new: true }
      );
  
      if (!comic) {
        return res.status(404).json({ message: 'Comic not found' });
      }
  
      res.status(200).json({
        message: 'Batch update successful',
        comic
      });
    } catch (error) {
      console.error('Error during batch update:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
