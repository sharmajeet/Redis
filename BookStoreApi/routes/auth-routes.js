const express = require('express');
const { get } = require('mongoose');
const { loginUser, registerUser } = require('../controllers/auth-controller.js');

const router = express.Router();


//all routes for auth
router.get('/login', loginUser);
router.post('/register', registerUser);

module.exports = router;