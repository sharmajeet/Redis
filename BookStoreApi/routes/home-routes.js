const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../middleware/auth-middleware.js');
const AdminMiddleware = require('../middleware/admin-middleware.js');

router.get('/home', AuthMiddleware,AdminMiddleware, (req, res) => {
    const { username, email, role } = req.user;
    res.status(200).json({
        message: "Welcome to the Book Store API!", User: [{
            username: username,
            email: email,
            role: role
        }]
    });
}
);

module.exports = router;