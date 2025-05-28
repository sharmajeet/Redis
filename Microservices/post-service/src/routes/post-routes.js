const express = require('express');
const {createPost} = require('../controllers/postController');
const {authenticateRequest} = require('../middlewares/auth-middleware');
const router = express.Router();


//we have to use the middleware to authenticate the user
router.use(authenticateRequest);

router.post('/create-post',authenticateRequest, createPost);

module.exports = router;
