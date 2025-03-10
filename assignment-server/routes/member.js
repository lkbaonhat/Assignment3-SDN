const express = require('express');
const router = express.Router();
const {
    getMembers,
    getMemberById,
    updateMember,
    updatePassword
} = require('../controllers/member');
const { protect, admin, isMemberOwner } = require('../middleware/auth');

// Get all members - Admin only
router.get('/', protect, admin, getMembers);

// Get member by ID - Owner or Admin
router.get('/:id', protect, getMemberById);

// Update member profile - Only the owner can update their profile
router.put('/:id', protect, isMemberOwner, updateMember);

// Update password - Only the owner can update their password
router.put('/:id/password', protect, isMemberOwner, updatePassword);

module.exports = router;