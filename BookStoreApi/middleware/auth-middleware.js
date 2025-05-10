const jwt = require('jsonwebtoken');


const AuthMiddleware = (req, res, next) => {
    console.log("AuthMiddleware called");
    const authToken = req.headers['authorization'];
    console.log("authToken:", authToken);
    const token = authToken && authToken.split(' ')[1];
    // Check if the token is provided in the Authorization header   
    if (!token) {
        return res.status(401).json({ success: false, message: "Token is missing." });
    }

    try {
        const decode = jwt.verify(token, process.env.AccessTokenSecret);
        req.user = decode; // Attach the decoded user information to the request object
        console.log("user:", decode);
        next();

    } catch (err) {
        return res.status(401).json({ success: false, message: "Token is invalid." });
    }
}

module.exports = AuthMiddleware;