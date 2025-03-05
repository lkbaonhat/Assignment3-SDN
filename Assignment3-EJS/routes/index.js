const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// Home page - display all perfumes
router.get('/', indexController.getHomePage);

// Search perfumes by name
router.get('/search', indexController.searchPerfumes);

// Filter perfumes by brand
router.get('/filter', indexController.filterPerfumesByBrand);

module.exports = router;