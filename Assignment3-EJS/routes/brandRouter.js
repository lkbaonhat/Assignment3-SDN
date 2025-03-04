const brandController = require('../controllers/brandController');
const express = require('express');
const brandRouter = express.Router();

brandRouter.route('/')
    .get(brandController.getAllBrands)
    .post(brandController.addBrand)

module.exports = brandRouter