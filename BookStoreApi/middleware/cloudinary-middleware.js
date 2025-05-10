const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files (jpeg, jpg, png, gif) are allowed!'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter,
});

const uploadImageMiddleware = (req, res, next) => {
    console.log('uploadImageMiddleware called');

    upload.single('image')(req, res, (err) => {
        if (err) {
            console.log('Error inside multer upload.single:', err);

            // Safely check if headers already sent
            if (!res.headersSent) {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return res.status(400).json({ success: false, error: 'File size exceeds the 5MB limit.' });
                    }
                    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                        return res.status(400).json({ success: false, error: err.message || 'Unexpected file upload error.' });
                    }
                    return res.status(400).json({ success: false, error: `Multer error: ${err.message}` });
                } else {
                    return res.status(400).json({ success: false, error: err.message });
                }
            } else {
                console.log('Response already sent. Cannot send another one.');
            }

            return; 
        }

        if (!req.file) {
            console.log('No file uploaded');

            if (!res.headersSent) {
                return res.status(400).json({ success: false, error: 'No file uploaded.' });
            } else {
                console.log('Response already sent. Cannot send another one.');
            }

            return; // IMPORTANT: STOP after sending response
        }

        console.log('File uploaded successfully:', req.file);
        next(); // If everything is fine, move to next controller
    });
};

module.exports = { uploadImageMiddleware };
