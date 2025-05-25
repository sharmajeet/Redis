const logger = require('../utils/logger');
const {validateUserRegistration} = require('../utils/validator');
const {generateToken} = require('../utils/generateToken');
const User = require('../models/User'); 

//user registration
const registerUser = async (req, res) => {
    try {

        //validate the request body -- through validator 
        const { error } = validateUserRegistration(req.body);
        if (error) {
            logger.warn('Validation error during user registration', { error: error.details[0].message });
            return res.status(400).json({ success : false, message: error.details[0].message });
        }

        const { username, email, password } = req.body;
        // Check if user already exists
        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            logger.warn('User already exists', { username, email });
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        // Create a new user
        user = new User  ({ username, email, password });
        await user.save();
        logger.info('User registered successfully', { username, email });

        //generate tokens
        const {accessToken, refreshToken} = await generateToken(user);

        res.status(201).json({ success : true , message: 'User registered successfully' , accessToken, refreshToken });

    } catch (error) {
        logger.error('Error during user registration', { error });
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}



//user login




//refresh token




//logout


module.exports = {registerUser}