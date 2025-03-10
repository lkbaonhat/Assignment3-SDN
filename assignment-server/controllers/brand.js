const { Types } = require('mongoose');
const Brand = require('../models/brand');
const Perfume = require('../models/perfume');

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find({});
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get brand by ID
// @route   GET /api/brands/:id
// @access  Public
const getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (brand) {
            res.json(brand);
        } else {
            res.status(404).json({ message: 'Brand not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = async (req, res) => {
    const { brandName } = req.body;

    try {
        const brandExists = await Brand.findOne({ brandName });

        if (brandExists) {
            return res.status(400).json({ message: 'Brand already exists' });
        }

        const brand = await Brand.create({ brandName });
        res.status(201).json(brand);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
const updateBrand = async (req, res) => {
    const { brandName } = req.body;

    try {
        const brand = await Brand.findById(req.params.id);

        if (brand) {
            brand.brandName = brandName;

            const updatedBrand = await brand.save();
            res.json(updatedBrand);
        } else {
            res.status(404).json({ message: 'Brand not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = async (req, res) => {
    try {
        const isPerfumeContain = await Perfume.find({ brand: new Types.ObjectId(req.params.id) });
        const brand = await Brand.findById(req.params.id);

        if (brand) {
            if (isPerfumeContain.length > 0) {
                return res.status(400).json({ message: 'Brand has perfumes' });
            } else {
                await brand.deleteOne();
                res.json({ message: 'Brand removed' });
            }
        } else {
            res.status(404).json({ message: 'Brand not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getBrands, getBrandById, createBrand, updateBrand, deleteBrand };