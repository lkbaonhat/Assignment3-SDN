const express = require('express');
const router = express.Router();
const {
    getPerfumes,
    getPerfumeById,
    createPerfume,
    updatePerfume,
    deletePerfume,
    searchPerfumes,
    filterPerfumesByBrand,
    addPerfumeComment,
    updatePerfumeComment,
    deletePerfumeComment
} = require('../controllers/perfume');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getPerfumes);
router.get('/:id', getPerfumeById);
router.get('/search/:keyword', searchPerfumes);
router.get('/brand/:brandId', filterPerfumesByBrand);

// Admin-only routes
router.post('/', protect, admin, createPerfume);
router.put('/:id', protect, admin, updatePerfume);
router.delete('/:id', protect, admin, deletePerfume);

// Comment routes - Authenticated users
router.post('/:id/comments', protect, addPerfumeComment);
router.put('/:id/comments/:commentId', protect, updatePerfumeComment);
router.delete('/:id/comments/:commentId', protect, deletePerfumeComment);

module.exports = router;