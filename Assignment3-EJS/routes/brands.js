const express = require('express');
const brandRouter = express.Router();
const brandController = require('../controllers/brandController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// GET all brands (admin)
brandRouter.get('/', isAuthenticated, isAdmin, brandController.getAllBrands);

// GET form to add new brand (admin)
brandRouter.get('/new', isAuthenticated, isAdmin, brandController.getNewBrandForm);

// POST new brand (admin)
brandRouter.post('/', isAuthenticated, isAdmin, brandController.createBrand);

// GET form to edit brand (admin)
brandRouter.get('/:id/edit', isAuthenticated, isAdmin, brandController.getEditBrandForm);

// PUT update brand (admin)
brandRouter.put('/:id', isAuthenticated, isAdmin, brandController.updateBrand);

// DELETE brand (admin)
brandRouter.delete('/:id', isAuthenticated, isAdmin, brandController.deleteBrand);

module.exports = brandRouter;