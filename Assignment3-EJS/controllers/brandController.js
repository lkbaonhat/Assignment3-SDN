const Brand = require('../models/brand');

const getAllBrands = async (req, res) => {
    try {
        const brandsData = await Brand.find();
        res.render('brands', { brands: brandsData });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const addBrand = async (req, res) => {
    try {
        const { brandName } = req.body;
        const newBrand = new Brand({ brandName });
        await newBrand.save();
        res.redirect('/brands');
    } catch (error) {
        res.json({ message: error.message });
    }
}

module.exports = { getAllBrands, addBrand }