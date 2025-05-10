const express = require('express');
const AuthMiddleware = require('../middleware/auth-middleware');
const { uploadImage,getImages } = require('../controllers/image-controller');
const { uploadImageMiddleware } = require('../middleware/uploadImage-middleware')
const {AdminMiddleware} = require('../middleware/admin-middleware');
const router = express.Router();

//upload image
router.post('/upload',AuthMiddleware, uploadImageMiddleware, uploadImage);

//get uploaded images
router.get('/images', AuthMiddleware, getImages);
// Todo  : implement the the middleware which return only images uploaded by the requested user

module.exports = router;
