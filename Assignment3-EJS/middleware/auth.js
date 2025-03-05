const jwt = require('jsonwebtoken');
const Member = require('../models/member');

// Middleware to verify if user is authenticated
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            req.flash('error_msg', 'Please log in to access this resource');
            return res.redirect('/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const member = await Member.findById(decoded.id);

        if (!member) {
            req.flash('error_msg', 'User not found');
            return res.redirect('/login');
        }

        req.member = member;
        next();
    } catch (error) {
        req.flash('error_msg', 'Invalid token. Please log in again.');
        res.redirect('/login');
    }
};

// Middleware to verify if user is admin
const isAdmin = (req, res, next) => {
    if (req.member && req.member.isAdmin) {
        return next();
    }

    req.flash('error_msg', 'Access denied. Admin privileges required');
    res.redirect('/');
};

// Middleware to verify if user is the owner of the resource
const isResourceOwner = (req, res, next) => {
    if (req.params.id && req.member && (req.params.id === req.member._id.toString() || req.member.isAdmin)) {
        return next();
    }

    req.flash('error_msg', 'Access denied. You can only manage your own account');
    res.redirect('/');
};

// Middleware to verify member owns their own profile for editing
const isSelfOrAdmin = (req, res, next) => {
    if (req.params.id && req.member && req.params.id === req.member._id.toString()) {
        return next();
    }

    req.flash('error_msg', 'Access denied. You can only edit your own profile');
    res.redirect('/');
};

module.exports = { isAuthenticated, isAdmin, isResourceOwner, isSelfOrAdmin };