const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = require('./comment');

const perfumeSchema = new Schema({
    perfumeName: {
        type: String,
        required: true
    },
    uri: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    concentration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    volume: {
        type: Number,
        required: true
    },
    targetAudience: {
        type: String,
        required: true,
        enum: ['male', 'female', 'unisex']
    },
    comments: [commentSchema],
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    }
}, {
    timestamps: true
});

const Perfume = mongoose.model('Perfume', perfumeSchema);

module.exports = Perfume;