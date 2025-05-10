const jwt = require('jsonwebtoken');

const AdminMiddleware = (req, res, next) => {
    console.log("AdminMiddleware called");
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

        // Check if the user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        next();

    } catch (err) {
        return res.status(401).json({ success: false, message: "Token is invalid." });
    }
    next();
}

module.exports = AdminMiddleware;