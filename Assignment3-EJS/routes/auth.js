const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated, isSelfOrAdmin } = require('../middleware/auth');

// Login page
authRouter.get('/login', authController.getLoginPage);

// Register page
authRouter.get('/register', authController.getRegisterPage);

// Register handle
authRouter.post('/register', authController.registerUser);

// Login handle
authRouter.post('/login', authController.loginUser);

// Profile page
authRouter.get('/profile/:id', isAuthenticated, isSelfOrAdmin, authController.getProfilePage);

// Update profile
authRouter.put('/profile/:id', isAuthenticated, isSelfOrAdmin, authController.updateProfile);

// Change password
authRouter.get('/change-password/:id', isAuthenticated, isSelfOrAdmin, authController.getChangePasswordPage);
authRouter.put('/change-password/:id', isAuthenticated, isSelfOrAdmin, authController.changePassword);

// Logout
authRouter.get('/logout', authController.logoutUser);

module.exports = authRouter;