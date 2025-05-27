const logger = require('../utils/logger');
const Post = require('../models/Post');

const createPost = async (req, res) => {
    try {
        const {content ,mediaIds } = await req.postService.createPost(req.body);
        res.status(201).json(post);
    } catch (error) {
        logger.error('Error while creating post:', error);
        res.status(500).json({ success  :false, message: 'Error while creating post' });
    }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await req.postService.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        logger.error('Error while fetching posts:', error);
        res.status(500).json({ success: false, message: 'Error while fetching posts' });
    }
}

const getPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await req.postService.getPost(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        logger.error('Error while fetching post:', error);
        res.status(500).json({ success: false, message: 'Error while fetching post' });
    }
}


const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const deletedPost = await req.postService.deletePost(postId);
        if (!deletedPost) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        logger.error('Error while deleting post:', error);
        res.status(500).json({ success: false, message: 'Error while deleting post' });
    }
}
