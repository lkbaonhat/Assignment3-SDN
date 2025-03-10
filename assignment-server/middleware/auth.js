const jwt = require('jsonwebtoken');
const Member = require('../models/member');

// Protect routes - verify token
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get member from the token
            req.member = await Member.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Admin middleware
const admin = (req, res, next) => {
    if (req.member && req.member.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

// Check if user is owner of the resource
const isOwner = (req, res, next) => {
    if (req.member && (req.member._id.toString() === req.params.id || req.member.isAdmin)) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized to edit this resource' });
    }
};

// Check if user is the owner of their profile (only the user can edit their profile)
const isMemberOwner = (req, res, next) => {
    if (req.member && req.member._id.toString() === req.params.id) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized to edit this member profile' });
    }
};

module.exports = { protect, admin, isOwner, isMemberOwner };