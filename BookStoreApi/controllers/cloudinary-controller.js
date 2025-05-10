const cloudinary = require('../config/cloudinary.js');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload buffer directly to Cloudinary
    const result = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Cloudinary upload failed' });
      }

      res.status(200).json({
        message: 'Image uploaded successfully!',
        url: result.secure_url,
        publicId: result.public_id
      });
    }).end(req.file.buffer); // Very important to call .end(buffer)
    
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { uploadImage };
