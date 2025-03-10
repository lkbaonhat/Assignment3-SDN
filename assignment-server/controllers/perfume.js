const Perfume = require('../models/perfume');
const Member = require('../models/member');

// @desc    Get all perfumes with brand info
// @route   GET /api/perfumes
// @access  Public
const getPerfumes = async (req, res) => {
    try {
        const perfumes = await Perfume.find({})
            .populate('brand', 'brandName')
            .select('perfumeName uri price targetAudience concentration brand comments');

        res.json(perfumes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get perfume by ID with full details
// @route   GET /api/perfumes/:id
// @access  Public
const getPerfumeById = async (req, res) => {
    try {
        const perfume = await Perfume.findById(req.params.id)
            .populate('brand', 'brandName')
            .populate('comments.author', 'name email');

        if (perfume) {
            res.json(perfume);
        } else {
            res.status(404).json({ message: 'Perfume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a perfume
// @route   POST /api/perfumes
// @access  Private/Admin
const createPerfume = async (req, res) => {
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

    try {
        const perfume = await Perfume.create({
            perfumeName,
            uri,
            price,
            concentration,
            description,
            ingredients,
            volume,
            targetAudience,
            brand,
            comments: []
        });

        const createdPerfume = await Perfume.findById(perfume._id).populate('brand', 'brandName');
        res.status(201).json(createdPerfume);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a perfume
// @route   PUT /api/perfumes/:id
// @access  Private/Admin
const updatePerfume = async (req, res) => {
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

    try {
        const perfume = await Perfume.findById(req.params.id);

        if (perfume) {
            perfume.perfumeName = perfumeName || perfume.perfumeName;
            perfume.uri = uri || perfume.uri;
            perfume.price = price || perfume.price;
            perfume.concentration = concentration || perfume.concentration;
            perfume.description = description || perfume.description;
            perfume.ingredients = ingredients || perfume.ingredients;
            perfume.volume = volume || perfume.volume;
            perfume.targetAudience = targetAudience || perfume.targetAudience;
            perfume.brand = brand || perfume.brand;

            const updatedPerfume = await perfume.save();
            res.json(await Perfume.findById(updatedPerfume._id).populate('brand', 'brandName'));
        } else {
            res.status(404).json({ message: 'Perfume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a perfume
// @route   DELETE /api/perfumes/:id
// @access  Private/Admin
const deletePerfume = async (req, res) => {
    try {
        const perfume = await Perfume.findById(req.params.id);

        if (perfume) {
            if (perfume.comments.length > 0) {
                res.status(400).json({ message: 'Cannot delete a perfume have comments' });
                return;
            }
            await perfume.deleteOne();
            res.json({ message: 'Perfume removed' });
        } else {
            res.status(404).json({ message: 'Perfume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search perfumes by name
// @route   GET /api/perfumes/search/:keyword
// @access  Public
const searchPerfumes = async (req, res) => {
    try {
        const keyword = req.params.keyword;
        const perfumes = await Perfume.find({
            perfumeName: { $regex: keyword, $options: 'i' }
        })
            .populate('brand', 'brandName')
            .select('perfumeName uri price targetAudience brand');

        res.json(perfumes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Filter perfumes by brand
// @route   GET /api/perfumes/brand/:brandId
// @access  Public
const filterPerfumesByBrand = async (req, res) => {
    try {
        const brandId = req.params.brandId;
        const perfumes = await Perfume.find({ brand: brandId })
            .populate('brand', 'brandName')
            .select('perfumeName uri price targetAudience brand');

        res.json(perfumes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add comment to perfume
// @route   POST /api/perfumes/:id/comments
// @access  Private
const addPerfumeComment = async (req, res) => {
    const { rating, content } = req.body;

    try {
        const perfume = await Perfume.findById(req.params.id);

        if (perfume) {
            // Check if user already commented on this perfume
            const alreadyCommented = perfume.comments.find(
                comment => comment.author.toString() === req.member._id.toString()
            );

            if (alreadyCommented) {
                return res.status(400).json({ message: 'You have already commented on this perfume' });
            }

            const comment = {
                rating: Number(rating),
                content,
                author: req.member._id
            };

            perfume.comments.push(comment);
            await perfume.save();

            const updatedPerfume = await Perfume.findById(req.params.id)
                .populate('brand', 'brandName')
                .populate('comments.author', 'name email');

            res.status(201).json(updatedPerfume);
        } else {
            res.status(404).json({ message: 'Perfume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update comment on perfume
// @route   PUT /api/perfumes/:id/comments/:commentId
// @access  Private
const updatePerfumeComment = async (req, res) => {
    const { rating, content } = req.body;

    try {
        const perfume = await Perfume.findById(req.params.id);

        if (perfume) {
            const commentIndex = perfume.comments.findIndex(
                comment => comment._id.toString() === req.params.commentId
            );

            if (commentIndex !== -1) {
                // Check if current user is the author of the comment
                if (perfume.comments[commentIndex].author.toString() !== req.member._id.toString()) {
                    return res.status(401).json({ message: 'You are not authorized to update this comment' });
                }

                perfume.comments[commentIndex].rating = Number(rating);
                perfume.comments[commentIndex].content = content;

                await perfume.save();

                const updatedPerfume = await Perfume.findById(req.params.id)
                    .populate('brand', 'brandName')
                    .populate('comments.author', 'name email');

                res.json(updatedPerfume);
            } else {
                res.status(404).json({ message: 'Comment not found' });
            }
        } else {
            res.status(404).json({ message: 'Perfume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete comment on perfume
// @route   DELETE /api/perfumes/:id/comments/:commentId
// @access  Private
const deletePerfumeComment = async (req, res) => {
    try {
        const perfume = await Perfume.findById(req.params.id);

        if (perfume) {
            const commentIndex = perfume.comments.findIndex(
                comment => comment._id.toString() === req.params.commentId
            );

            if (commentIndex !== -1) {
                // Check if current user is the author of the comment
                if (perfume.comments[commentIndex].author.toString() !== req.member._id.toString() && !req.member.isAdmin) {
                    return res.status(401).json({ message: 'You are not authorized to delete this comment' });
                }

                perfume.comments.splice(commentIndex, 1);
                await perfume.save();

                res.json({ message: 'Comment removed' });
            } else {
                res.status(404).json({ message: 'Comment not found' });
            }
        } else {
            res.status(404).json({ message: 'Perfume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
};