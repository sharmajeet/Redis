const express = require('express');
const {createPost,getAllPosts,getPost} = require('../controllers/postController');
const {authenticateRequest} = require('../middlewares/auth-middleware');
const router = express.Router();


//we have to use the middleware to authenticate the user
router.use(authenticateRequest);

router.post('/create-post', createPost);

router.get('/all-posts', getAllPosts);

router.get('/:id', getPost);

module.exports = router;
