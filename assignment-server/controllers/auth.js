const Member = require('../models/member');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new member
// @route   POST /api/auth/register
// @access  Public
const registerMember = async (req, res) => {
    const { email, password, name, YOB, gender } = req.body;

    try {
        // Check if member already exists
        const memberExists = await Member.findOne({ email });

        if (memberExists) {
            return res.status(400).json({ message: 'Member already exists' });
        }

        // Create new member
        const member = await Member.create({
            email,
            password,
            name,
            YOB,
            gender,
            isAdmin: false // Default role is not admin
        });

        if (member) {
            res.status(201).json({
                _id: member._id,
                email: member.email,
                name: member.name,
                YOB: member.YOB,
                gender: member.gender,
                isAdmin: member.isAdmin,
                token: generateToken(member._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid member data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth member & get token
// @route   POST /api/auth/login
// @access  Public
const loginMember = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for member email
        const member = await Member.findOne({ email });

        if (member && (await member.matchPassword(password))) {
            res.json({
                _id: member._id,
                email: member.email,
                name: member.name,
                YOB: member.YOB,
                gender: member.gender,
                isAdmin: member.isAdmin,
                token: generateToken(member._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerMember, loginMember };