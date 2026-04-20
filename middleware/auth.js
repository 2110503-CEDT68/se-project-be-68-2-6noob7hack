const jwt = require('jsonwebtoken');
const User = require('../models/User');

// =====================================================
// Protect routes — supports BOTH header & cookie
// =====================================================
exports.protect = async (req, res, next) => {
    let token;

    // 1) Authorization header (Bearer token)
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 2) Cookie fallback
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // No token found
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user (exclude password for safety)
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        // Attach user to request
        req.user = user;

        next();

    } catch (err) {
        console.error('Auth error:', err.message);

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

        // Ensure protect() ran first
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Check role
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized`
            });
        }

        next();
    };
};