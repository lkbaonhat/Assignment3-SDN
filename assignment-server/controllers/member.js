const Member = require('../models/member');
const bcrypt = require('bcrypt');

// @desc    Get all members
// @route   GET /api/members
// @access  Private/Admin
const getMembers = async (req, res) => {
    try {
        const members = await Member.find({}).select('-password');
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get member profile
// @route   GET /api/members/:id
// @access  Private (owner or admin)
const getMemberById = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id).select('-password');

        if (member) {
            res.json(member);
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update member profile
// @route   PUT /api/members/:id
// @access  Private (only owner)
const updateMember = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);

        if (member) {
            member.name = req.body.name || member.name;
            member.email = req.body.email || member.email;
            member.YOB = req.body.YOB || member.YOB;
            member.gender = req.body.gender !== undefined ? req.body.gender : member.gender;

            const updatedMember = await member.save();

            res.json({
                _id: updatedMember._id,
                name: updatedMember.name,
                email: updatedMember.email,
                YOB: updatedMember.YOB,
                gender: updatedMember.gender,
                isAdmin: updatedMember.isAdmin,
            });
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Change member password
// @route   PUT /api/members/:id/password
// @access  Private (only owner)
const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const member = await Member.findById(req.params.id);

        if (member) {
            // Check if current password matches
            if (await member.matchPassword(currentPassword) && currentPassword === newPassword) {
                res.status(400).json({ message: 'New password must be different from the current password' });
            } else if (await member.matchPassword(currentPassword) && currentPassword !== newPassword) {
                member.password = newPassword;
                await member.save();
                res.json({ message: 'Password updated successfully' });
            } else {
                res.status(400).json({ message: 'Current password is incorrect' });
            }
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMembers, getMemberById, updateMember, updatePassword };