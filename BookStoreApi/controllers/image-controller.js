const { uploadToS3, generateGetSignedUrl } = require('../helpers/s3-helpers');
const Image = require('../models/image');
const User = require('../models/user'); // Assuming you have a User model

const uploadImage = async (req, res) => {
    console.log("Received file:", req.file);
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded." });
        }

        // Upload image to S3
        const { url, publicId, bucket, key } = await uploadToS3(req.file);

        console.log("Image uploaded to S3:", url, publicId);

        // Generate a pre-signed GET URL (valid for 1 hour)
        const signedUrl = await generateGetSignedUrl({ Bucket: bucket, Key: key, Expires: 3600 });

        // Save image info to MongoDB
        const image = new Image({
            imageUrl: url,
            publicId: publicId,
            uploadedBy: req.user.userId
        });

        await image.save();

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully.",
            image: {
                id: image._id,
                url: image.imageUrl,
                publicId: image.publicId,
                signedUrl,
                uploadedBy: image.uploadedBy,
            },
        });
    } catch (error) {
        console.error("Error uploading image:", error.message);
        res.status(500).json({ success: false, message: error.message || "Error uploading image." });
    }
};

// Get All Images with Pre-Signed URLs
const getImages = async (req, res) => {
    try {
        const images = await Image.find({}).populate('uploadedBy', 'name'); 

        const imagesWithSignedUrl = await Promise.all(images.map(async (img) => {
            const signedUrl = await generateGetSignedUrl({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: img.publicId,
                Expires: 3600,
            });

            return {
                id: img._id,
                publicId: img.publicId,
                url: signedUrl,
                uploadedBy: img.uploadedBy?.name || "Unknown User",
            };
        }));

        res.status(200).json({
            success: true,
            message: "Images fetched successfully.",
            images: imagesWithSignedUrl
        });

    } catch (error) {
        console.error("Error fetching images:", error.message);
        res.status(500).json({ success: false, message: error.message || "Error fetching images." });
    }
};

module.exports = { uploadImage , getImages };
