const Perfume = require('../models/perfume');
const Brand = require('../models/brand');

const getAllPerfumesHomePage = async (req, res) => {
    try {
        const perfumesData = await Perfume.find().populate('brand', 'brandName');
        res.render('index', { perfumes: perfumesData });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getAllPerfumes = async (req, res) => {
    try {
        const perfumesData = await Perfume.find().populate('brand', 'brandName');
        const brandsData = await Brand.find();
        res.render('perfumes', { perfumes: perfumesData, brands: brandsData });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getDetailPerfumeHomePage = async (req, res) => {
    try {
        console.log(req.params.perfumeID);
        const perfumeData = await Perfume.findById(req.params.perfumeID).populate('brand', 'brandName');
        const brandsData = await Brand.find();
        res.render('perfumeDetail', { perfume: perfumeData, brands: brandsData });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getDetailPerfume = async (req, res) => {
    try {
        const perfumeData = await Perfume.findById(req.params.perfumeID).populate('brand', 'brandName');
        const brandsData = await Brand.find();
        res.render('edit', { perfume: perfumeData, brands: brandsData });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const addPerfume = async (req, res) => {
    try {
        console.log(req.body);
        const newPerfume = new Perfume(req.body);
        await newPerfume.save();
        res.redirect('/perfumes');
    } catch (error) {
        res.json({ message: error.message });
    }
}

const updatePerfume = async (req, res) => {
    try {
        const updatedPerfume
            = await Perfume.findByIdAndUpdate(req.params.perfumeID, req.body, { new: true });
        res.redirect('/perfumes');
    }
    catch (error) {
        res.json({ message: error.message });
    }
}

const deletePerfume = async (req, res) => {
    try {
        await Perfume.findByIdAndDelete(req.params.perfumeID);
        res.redirect('/perfumes');
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = { getAllPerfumes, addPerfume, deletePerfume, updatePerfume, getDetailPerfume, getAllPerfumesHomePage, getDetailPerfumeHomePage }