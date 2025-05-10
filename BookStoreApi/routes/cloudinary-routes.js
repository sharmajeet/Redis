const express = require('express');
const { uploadImage, deleteImage, getUserImages } = require('../controllers/cloudinary-controller');
const AuthMiddleware = require('../middleware/auth-middleware');
const router = express.Router();
const { AdminMiddleware } = require('../middleware/admin-middleware');
const { uploadImageMiddleware } = require('../middleware/cloudinary-middleware');

// Upload image
router.post('/upload', AuthMiddleware, uploadImageMiddleware, uploadImage);
// router.get('/my-images', AuthMiddleware, getUserImages);
// router.delete('/delete/:publicId', AuthMiddleware, deleteImage);
// router.get('/delete/:publicId', AuthMiddleware, deleteImage);


module.exports = router;