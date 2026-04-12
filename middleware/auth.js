const jwt = require('jsonwebtoken');
const User = require('../models/User');

// =====================================================
// Protect routes
// =====================================================
exports.protect = async (req, res, next) => {
    let token;

    // Get token from header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // No token
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user (IMPORTANT: exclude password)
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        req.user = user;

        next();

    } catch (err) {
        console.error(err.message);

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// =====================================================
// Role-based authorization
// =====================================================
exports.authorize = (...roles) => {
    return (req, res, next) => {

        // Safety check (protect must run first)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized`
            });
        }

        next();
    };
};