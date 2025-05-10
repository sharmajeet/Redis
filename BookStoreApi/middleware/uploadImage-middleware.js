const multer = require('multer');

// Use memory storage to keep the file in memory buffer (for direct upload to S3)
const storage = multer.memoryStorage();

// File filter to allow only specific image types
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files (jpeg, jpg, png, gif) are allowed!'));
    }
};

// Multer configuration
const upload = multer({
    storage,
    limits: { fileSize: 1* 1024 * 1024 }, // 5MB limit
    fileFilter,
});

// Middleware to handle single file upload
const uploadImageMiddleware = (req, res, next) => {
    console.log('uploadImageMiddleware called');
    
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, error: `File size exceeds the ${limits} limit.` });
            }
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ success: false, error: err.message || 'Unexpected file upload error.' });
            }
            return res.status(400).json({ success: false, error: `Multer error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ success: false, error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded.' });
        }

        console.log('File uploaded successfully:', req.file);
        next();
    });
};

module.exports = { uploadImageMiddleware };
