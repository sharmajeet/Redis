// controllers/cloudinary-controller.js
const cloudinary = require('../config/cloudinary');
const Image = require('../models/image'); // Import the Image model

const uploadImage = async (req, res) => {
  try {
    // If no file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload buffer to Cloudinary
    cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: 'Cloudinary upload failed' });
        }

        // Save image info in MongoDB
        const newImage = new Image({
          url: result.secure_url, // Cloudinary secure URL
          publicId: result.public_id, // Cloudinary publicId
          uploadedBy: req.userId, // User that uploaded the image (assuming you have the userId in the request)
        });

        await newImage.save();

        res.status(200).json({
          message: 'Image uploaded successfully!',
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    ).end(req.file.buffer); // Use .end to push the buffer to Cloudinary
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { uploadImage };
