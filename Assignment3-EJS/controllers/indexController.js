const Perfume = require('../models/perfume');
const Brand = require('../models/brand');

getHomePage = async (req, res) => {
    try {
        const perfumes = await Perfume.find().populate('brand', 'brandName');
        const brands = await Brand.find().sort('brandName');

        res.render('index', {
            title: 'Perfume Collection',
            perfumes,
            brands,
            currentUser: req.member || null
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.status(500).render('error', { error });
    }
};

searchPerfumes = async (req, res) => {
    try {
        const { query } = req.query;
        const searchRegex = new RegExp(query, 'i');

        const perfumes = await Perfume.find({ perfumeName: searchRegex })
            .populate('brand', 'brandName');
        const brands = await Brand.find().sort('brandName');

        res.render('index', {
            title: `Search results for: "${query}"`,
            perfumes,
            brands,
            searchQuery: query,
            currentUser: req.member || null
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Search error');
        res.redirect('/');
    }
};

filterPerfumesByBrand = async (req, res) => {
    try {
        const { brandId } = req.query;
        const filter = brandId ? { brand: brandId } : {};

        const perfumes = await Perfume.find(filter)
            .populate('brand', 'brandName');
        const brands = await Brand.find().sort('brandName');
        const selectedBrand = brandId ? await Brand.findById(brandId) : null;

        res.render('index', {
            title: selectedBrand ? `Perfumes by ${selectedBrand.brandName}` : 'All Perfumes',
            perfumes,
            brands,
            selectedBrandId: brandId,
            currentUser: req.member || null
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Filter error');
        res.redirect('/');
    }
};

module.exports = {
    getHomePage,
    searchPerfumes,
    filterPerfumesByBrand
};