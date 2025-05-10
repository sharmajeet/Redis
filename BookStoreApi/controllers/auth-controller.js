const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Check if the user exists in the database
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const accessToken = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            process.env.AccessTokenSecret,
            { expiresIn: '1h' }
        )

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            accessToken
        });

    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
}


const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // First check if the data is valid
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // First check if the user exists in the database
        const user = await User.findOne({ $or: [{ username: username }, { email: email }] });
        if (user) {
            return res.status(400).json({ message: "User with this username or email is already present." });
        }

        // Validate role (optional step)
        const validRoles = ['user', 'admin'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role. Role must be either 'user' or 'admin'." });
        }

        // Create a salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await newUser.save();
        return res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
}


module.exports = {
    loginUser,
    registerUser
}