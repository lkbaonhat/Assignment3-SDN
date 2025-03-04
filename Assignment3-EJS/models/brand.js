const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
    brandName: {
        type: String,
    }
}, { timestamps: true });

const Brand = mongoose.model('brands', brandSchema)
module.exports = Brand;