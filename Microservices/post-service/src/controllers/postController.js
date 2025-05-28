const logger = require('../utils/logger');
const Post = require('../models/Post');
const { validateNewPost } = require('../utils/validator');

const createPost = async (req, res) => {
  try {
    logger.info('Validating request body for creating post:', req.body);
    const { error } = validateNewPost(req.body);
    if (error) {
      logger.warn('Validation error while creating post:', error.details[0].message);
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { content, mediaIds } = req.body;

    const post = new Post({
      user: req.user._id,
      content,
      mediaIds
    });

    await post.save();

    logger.info('Post created successfully:', post);
    res.status(201).json({ success: true, message: 'Post created successfully', post });
  } catch (error) {
    logger.error('Error while creating post:', error);
    res.status(500).json({ success: false, message: 'Error while creating post' });
  }
};

module.exports = {
  createPost
};
