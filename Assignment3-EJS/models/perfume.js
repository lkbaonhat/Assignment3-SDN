const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 3,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "members",
        require: true
    }
}, { timestamps: true })

const perfumeSchema = new Schema({
    perfumeName: {
        type: String,
        require: true
    },
    uri: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    concentration: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    ingredients: {
        type: String,
        require: true
    },
    volume: {
        type: Number,
        require: true
    },
    targetAudience: {
        type: String,
        require: true
    },
    comments: [commentSchema],
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brands",
        require: true
    },
});

const Perfume = mongoose.model('perfumes', perfumeSchema)
module.exports = Perfume;