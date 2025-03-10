const Perfume = require('../models/perfume');
const Brand = require('../models/brand');

const getPerfumeDetails = async (req, res) => {
    try {
        const perfume = await Perfume.findById(req.params.id)
            .populate('brand', 'brandName')
            .populate('comments.author', 'name email');

        if (!perfume) {
            req.flash('error_msg', 'Perfume not found');
            return res.redirect('/');
        }

        let userComment = null;
        if (req.member) {
            userComment = perfume.comments.find(comment =>
                comment.author._id.toString() === req.member._id.toString()
            );
        }

        res.render('perfume-detail', {
            title: perfume.perfumeName,
            perfume,
            userComment,
            currentUser: req.member || null
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect('/');
    }
};

const getAllPerfumes = async (req, res) => {
    try {
        const perfumes = await Perfume.find()
            .populate('brand', 'brandName')
            .sort('-createdAt');

        res.render('perfume-management', {
            title: 'Perfume Management',
            perfumes,
            currentUser: req.member
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect('/');
    }
};

const getNewPerfumeForm = async (req, res) => {
    try {
        const brands = await Brand.find().sort('brandName');

        res.render('perfume-form', {
            title: 'Add New Perfume',
            brands,
            perfume: null,
            currentUser: req.member
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect('/perfumes');
    }
};

const createPerfume = async (req, res) => {
    try {
        const {
            perfumeName,
            uri,
            price,
            concentration,
            description,
            ingredients,
            volume,
            targetAudience,
            brand
        } = req.body;

        // Validate inputs
        if (!perfumeName || !uri || !price || !concentration || !description ||
            !ingredients || !volume || !targetAudience || !brand) {
            req.flash('error_msg', 'All fields are required');
            const brands = await Brand.find().sort('brandName');
            return res.render('perfume-form', {
                title: 'Add New Perfume',
                brands,
                perfume: req.body,
                currentUser: req.member
            });
        }

        const newPerfume = new Perfume({
            perfumeName,
            uri,
            price,
            concentration,
            description,
            ingredients,
            volume,
            targetAudience,
            brand
        });

        await newPerfume.save();

        req.flash('success_msg', 'Perfume added successfully');
        res.redirect('/perfumes');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect('/perfumes/new');
    }
};

const getEditPerfumeForm = async (req, res) => {
    try {
        const perfume = await Perfume.findById(req.params.id);
        const brands = await Brand.find().sort('brandName');

        if (!perfume) {
            req.flash('error_msg', 'Perfume not found');
            return res.redirect('/perfumes');
        }

        res.render('perfume-form', {
            title: `Edit ${perfume.perfumeName}`,
            perfume,
            brands,
            currentUser: req.member
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect('/perfumes');
    }
};

const updatePerfume = async (req, res) => {
    try {
        const {
            perfumeName,
            uri,
            price,
            concentration,
            description,
            ingredients,
            volume,
            targetAudience,
            brand
        } = req.body;

        // Validate inputs
        if (!perfumeName || !uri || !price || !concentration || !description ||
            !ingredients || !volume || !targetAudience || !brand) {
            req.flash('error_msg', 'All fields are required');
            return res.redirect(`/perfumes/${req.params.id}/edit`);
        }

        const updatedPerfume = await Perfume.findByIdAndUpdate(
            req.params.id,
            {
                perfumeName,
                uri,
                price,
                concentration,
                description,
                ingredients,
                volume,
                targetAudience,
                brand
            },
            { new: true, runValidators: true }
        );

        if (!updatedPerfume) {
            req.flash('error_msg', 'Perfume not found');
            return res.redirect('/perfumes');
        }

        req.flash('success_msg', 'Perfume updated successfully');
        res.redirect('/perfumes');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect(`/perfumes/${req.params.id}/edit`);
    }
};

const deletePerfume = async (req, res) => {
    try {
        const deletedPerfume = await Perfume.findByIdAndDelete(req.params.id);

        if (!deletedPerfume) {
            req.flash('error_msg', 'Perfume not found');
        } else {
            req.flash('success_msg', 'Perfume deleted successfully');
        }

        res.redirect('/perfumes');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect('/perfumes');
    }
};

const addComment = async (req, res) => {
    try {
        const { rating, content } = req.body;
        const perfume = await Perfume.findById(req.params.id);

        if (!perfume) {
            req.flash('error_msg', 'Perfume not found');
            return res.redirect('/');
        }

        // Check if user already commented on this perfume
        const existingCommentIndex = perfume.comments.findIndex(
            comment => comment.author.toString() === req.member._id.toString()
        );

        if (existingCommentIndex !== -1) {
            // Update existing comment
            perfume.comments[existingCommentIndex].rating = rating;
            perfume.comments[existingCommentIndex].content = content;
        } else {
            // Add new comment
            perfume.comments.push({
                rating,
                content,
                author: req.member._id
            });
        }

        await perfume.save();

        req.flash('success_msg', 'Your comment has been saved');
        res.redirect(`/perfumes/${req.params.id}`);
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect(`/perfumes/${req.params.id}`);
    }
};

const deleteComment = async (req, res) => {
    try {
        const perfume = await Perfume.findById(req.params.id);

        if (!perfume) {
            req.flash('error_msg', 'Perfume not found');
            return res.redirect('/');
        }

        // Find comment by ID
        const comment = perfume.comments.id(req.params.commentId);

        if (!comment) {
            req.flash('error_msg', 'Comment not found');
            return res.redirect(`/perfumes/${req.params.id}`);
        }

        // Check if user is the comment author
        if (comment.author.toString() !== req.member._id.toString() && !req.member.isAdmin) {
            req.flash('error_msg', 'Access denied');
            return res.redirect(`/perfumes/${req.params.id}`);
        }

        // Remove comment
        perfume.comments.remove(comment);
        await perfume.save();

        req.flash('success_msg', 'Comment deleted successfully');
        res.redirect(`/perfumes/${req.params.id}`);
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect(`/perfumes/${req.params.id}`);
    }
};

module.exports = {
    getPerfumeDetails,
    getAllPerfumes,
    getNewPerfumeForm,
    createPerfume,
    getEditPerfumeForm,
    updatePerfume,
    deletePerfume,
    addComment,
    deleteComment
};