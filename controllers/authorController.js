const Comic = require('../models/authorModel');

exports.getAuthorDetail = async (req, res) => {
    try {
        console.log("MISS you")
      const { authorId } = req.params;
      console.log("Auhtor ID",authorId)
      const comic = await Comic.findOne({ authorId });
  
      if (!comic) {
        return res.status(404).json({ message: 'Author not found' });
      }
  
      res.status(200).json({
        message: 'Author details retrieved successfully',
        authorId:comic.authorId,
        comicId: comic.comicId,         // Include comicId for clarity
        comic_name: comic.comic_name,    // Include comic_name explicitly         // You can include other fields if needed

      });
    } catch (error) {
      console.error('Error retrieving Author details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
