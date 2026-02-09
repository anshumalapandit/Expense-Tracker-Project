const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    // Get token from header
    let token = req.headers.authorization?.split(" ")[1];
    
    // Check if token exists
    if (!token) {
        return res.status(401).json({ 
            message: "Not authorized, no token" 
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database (excluding password)
        req.user = await User.findById(decoded.id).select('-password');
        
        // Continue to next middleware/route
        next();
    } catch (err) {
        res.status(401).json({ 
            message: "Not authorized, token failed" 
        });
    }
};