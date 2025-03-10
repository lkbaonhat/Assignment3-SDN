const express = require('express');
const router = express.Router();
const {
    getBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand
} = require('../controllers/brand');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getBrands);
router.get('/:id', getBrandById);

// Admin-only routes
router.post('/', protect, admin, createBrand);
router.put('/:id', protect, admin, updateBrand);
router.delete('/:id', protect, admin, deleteBrand);

module.exports = router;