const Brand = require('../models/brand');
const Perfume = require('../models/perfume');

getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find().sort('brandName');

        res.render('brand-management', {
            title: 'Brand Management',
            brands,
            currentUser: req.member
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect('/');
    }
};

getNewBrandForm = (req, res) => {
    res.render('brand-form', {
        title: 'Add New Brand',
        brand: null,
        currentUser: req.member
    });
};

createBrand = async (req, res) => {
    try {
        const { brandName } = req.body;

        if (!brandName) {
            req.flash('error_msg', 'Brand name is required');
            return res.render('brand-form', {
                title: 'Add New Brand',
                brand: req.body,
                currentUser: req.member
            });
        }

        // Check if brand already exists
        const existingBrand = await Brand.findOne({
            brandName: { $regex: new RegExp(`^${brandName}$`, 'i') }
        });

        if (existingBrand) {
            req.flash('error_msg', 'Brand already exists');
            return res.render('brand-form', {
                title: 'Add New Brand',
                brand: req.body,
                currentUser: req.member
            });
        }

        const newBrand = new Brand({ brandName });
        await newBrand.save();

        req.flash('success_msg', 'Brand added successfully');
        res.redirect('/brands');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect('/brands/new');
    }
};

getEditBrandForm = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            req.flash('error_msg', 'Brand not found');
            return res.redirect('/brands');
        }

        res.render('brand-form', {
            title: `Edit ${brand.brandName}`,
            brand,
            currentUser: req.member
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect('/brands');
    }
};

updateBrand = async (req, res) => {
    try {
        const { brandName } = req.body;

        if (!brandName) {
            req.flash('error_msg', 'Brand name is required');
            return res.redirect(`/brands/${req.params.id}/edit`);
        }

        // Check if another brand with the same name exists
        const existingBrand = await Brand.findOne({
            brandName: { $regex: new RegExp(`^${brandName}$`, 'i') },
            _id: { $ne: req.params.id }
        });

        if (existingBrand) {
            req.flash('error_msg', 'Brand name already in use');
            return res.redirect(`/brands/${req.params.id}/edit`);
        }

        const updatedBrand = await Brand.findByIdAndUpdate(
            req.params.id,
            { brandName },
            { new: true, runValidators: true }
        );

        if (!updatedBrand) {
            req.flash('error_msg', 'Brand not found');
            return res.redirect('/brands');
        }

        req.flash('success_msg', 'Brand updated successfully');
        res.redirect('/brands');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect(`/brands/${req.params.id}/edit`);
    }
};

deleteBrand = async (req, res) => {
    try {
        // Check if brand is used in any perfumes
        const perfumesWithBrand = await Perfume.countDocuments({ brand: req.params.id });

        if (perfumesWithBrand > 0) {
            req.flash('error_msg', `Cannot delete brand: it's used by ${perfumesWithBrand} perfume(s)`);
            return res.redirect('/brands');
        }

        const deletedBrand = await Brand.findByIdAndDelete(req.params.id);

        if (!deletedBrand) {
            req.flash('error_msg', 'Brand not found');
        } else {
            req.flash('success_msg', 'Brand deleted successfully');
        }

        res.redirect('/brands');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect('/brands');
    }
};

module.exports = {
    getAllBrands,
    getNewBrandForm,
    createBrand,
    getEditBrandForm,
    updateBrand,
    deleteBrand
}; 