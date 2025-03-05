const Member = require('../models/member');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

getLoginPage = (req, res) => {
    res.render('login', { title: 'Login' });
};

getRegisterPage = (req, res) => {
    res.render('register', { title: 'Register' });
};

registerUser = async (req, res) => {
    const { email, password, password2, name, YOB, gender } = req.body;
    let errors = [];

    // Check required fields
    if (!email || !password || !password2 || !name || !YOB || gender === undefined) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
        return res.render('register', {
            title: 'Register',
            errors,
            email,
            name,
            YOB,
            gender
        });
    }

    try {
        // Check if email exists
        const existingUser = await Member.findOne({ email });

        if (existingUser) {
            errors.push({ msg: 'Email is already registered' });
            return res.render('register', {
                title: 'Register',
                errors,
                email,
                name,
                YOB,
                gender
            });
        }

        // Create new member
        const newMember = new Member({
            email,
            password,
            name,
            YOB,
            gender: gender === 'true'
        });

        // Save member
        await newMember.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error during registration');
        res.redirect('/auth/register');
    }
};

loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const member = await Member.findOne({ email });

        if (!member) {
            req.flash('error_msg', 'Email not registered');
            return res.redirect('/auth/login');
        }

        // Match password
        const isMatch = await member.matchPassword(password);
        if (!isMatch) {
            req.flash('error_msg', 'Incorrect password');
            return res.redirect('/auth/login');
        }

        // Create JWT token
        const token = jwt.sign(
            { id: member._id, isAdmin: member.isAdmin },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1d' }
        );

        // Set cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        req.flash('success_msg', 'You are now logged in');
        res.redirect('/');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error during login');
        res.redirect('/auth/login');
    }
};

getProfilePage = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            req.flash('error_msg', 'Member not found');
            return res.redirect('/');
        }

        res.render('profile', {
            title: 'Profile',
            member,
            currentUser: req.member
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect('/');
    }
};

updateProfile = async (req, res) => {
    try {
        const { name, YOB, gender } = req.body;

        // Only allow updating specific fields
        const updates = {
            name,
            YOB,
            gender: gender === 'true'
        };

        const updatedMember = await Member.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedMember) {
            req.flash('error_msg', 'Member not found');
            return res.redirect('/');
        }

        req.flash('success_msg', 'Profile updated successfully');
        res.redirect(`/auth/profile/${req.params.id}`);
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect(`/auth/profile/${req.params.id}`);
    }
};

getChangePasswordPage = (req, res) => {
    res.render('change-password', {
        title: 'Change Password',
        memberId: req.params.id,
        currentUser: req.member
    });
};

changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            req.flash('error_msg', 'Please fill in all fields');
            return res.redirect(`/auth/change-password/${req.params.id}`);
        }

        if (newPassword !== confirmPassword) {
            req.flash('error_msg', 'New passwords do not match');
            return res.redirect(`/auth/change-password/${req.params.id}`);
        }

        if (newPassword.length < 6) {
            req.flash('error_msg', 'New password should be at least 6 characters');
            return res.redirect(`/auth/change-password/${req.params.id}`);
        }

        const member = await Member.findById(req.params.id);

        if (!member) {
            req.flash('error_msg', 'Member not found');
            return res.redirect('/');
        }

        // Verify current password
        const isMatch = await member.matchPassword(currentPassword);

        if (!isMatch) {
            req.flash('error_msg', 'Current password is incorrect');
            return res.redirect(`/auth/change-password/${req.params.id}`);
        }

        // Update password
        member.password = newPassword;
        await member.save();

        req.flash('success_msg', 'Password changed successfully');
        res.redirect(`/auth/profile/${req.params.id}`);
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect(`/auth/change-password/${req.params.id}`);
    }
};

logoutUser = (req, res) => {
    res.clearCookie('jwt');
    req.flash('success_msg', 'You are logged out');
    res.redirect('/auth/login');
};

module.exports = {
    getLoginPage,
    getRegisterPage,
    registerUser,
    loginUser,
    getProfilePage,
    updateProfile,
    getChangePasswordPage,
    changePassword,
    logoutUser
};