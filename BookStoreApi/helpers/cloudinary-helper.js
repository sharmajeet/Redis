const { cloudinary } = require('../config/cloudinary');
const Image = require('../models/image');
const fs = require('fs');
const path = require('path');

const uploadImage = async (filePath) => {
    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'bookstore-images', // Optional: specify a folder in Cloudinary
            use_filename: true, // Use the original filename
            unique_filename: false, // Do not generate a unique filename
        });

        // Remove the local file after uploading to Cloudinary
        fs.unlinkSync(filePath);

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error.message);
        throw new Error('Error uploading image to Cloudinary');
    }
}

// const saveImageToDB = async (imageData) => {
//     try {
//         const image = new Image(imageData);
//         await image.save();
//         return image;
//     } catch (error) {
//         console.error('Error saving image to database:', error.message);
//         throw new Error('Error saving image to database');
//     }
// };

// const deleteImageFromDB = async (publicId) => {
//     try {
//         await Image.delete
//         One({ publicId });
//     }
//     catch (error) {
//         console.error('Error deleting image from database:', error.message);
//         throw new Error('Error deleting image from database');
//     }
// }

// const deleteImageFromCloudinary = async (publicId) => {
//     try {
//         await cloudinary.uploader.destroy(publicId);
//     } catch (error) {
//         console.error('Error deleting image from Cloudinary:', error.message);
//         throw new Error('Error deleting image from Cloudinary');
//     }
// };

// const getUserImages = async (userId) => {
//     try {
//         const images = await Image.find({ uploadedBy: userId }).sort({ createdAt: -1 });
//         return images;
//     } catch (error) {
//         console.error('Error fetching user images:', error.message);
//         throw new Error('Error fetching user images');
//     }
// };

module.exports = {
    uploadImage,
    // saveImageToDB,
    // deleteImageFromDB,
    // deleteImageFromCloudinary,
    // getUserImages
};
