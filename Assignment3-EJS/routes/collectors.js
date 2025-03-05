const express = require('express');
const collectorRouter = express.Router();
const memberController = require('../controllers/memberController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// GET all members (admin only)
collectorRouter.get('/', isAuthenticated, isAdmin, memberController.getAllMembers);

module.exports = collectorRouter;