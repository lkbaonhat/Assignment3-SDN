const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        default: ''
    },
    YOB: {
        type: Number,
        default: 0
    },
    gender: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Member = mongoose.model('members', memberSchema)
module.exports = Member;

