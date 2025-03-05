const express = require('express');
const perfumeRouter = express.Router();
const perfumeController = require('../controllers/perfumeController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// GET all perfumes (admin)
perfumeRouter.get('/', isAuthenticated, isAdmin, perfumeController.getAllPerfumes);

// GET form to add new perfume (admin)
perfumeRouter.get('/new', isAuthenticated, isAdmin, perfumeController.getNewPerfumeForm);

// POST new perfume (admin)
perfumeRouter.post('/', isAuthenticated, isAdmin, perfumeController.createPerfume);

// GET form to edit perfume (admin)
perfumeRouter.get('/:id/edit', isAuthenticated, isAdmin, perfumeController.getEditPerfumeForm);

// GET perfume details - this needs to be after more specific routes
perfumeRouter.get('/:id', perfumeController.getPerfumeDetails);

// PUT update perfume (admin)
perfumeRouter.put('/:id', isAuthenticated, isAdmin, perfumeController.updatePerfume);

// DELETE perfume (admin)
perfumeRouter.delete('/:id', isAuthenticated, isAdmin, perfumeController.deletePerfume);

// POST comment on perfume
perfumeRouter.post('/:id/comment', isAuthenticated, perfumeController.addComment);

// DELETE comment from perfume
perfumeRouter.delete('/:id/comment/:commentId', isAuthenticated, perfumeController.deleteComment);

module.exports = perfumeRouter;