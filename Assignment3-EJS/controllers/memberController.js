const Member = require('../models/member');

const getAllMembers = async (req, res) => {
    try {
        const members = await Member.find().select('-password').sort('name');

        res.render('collectors', {
            title: 'Member Collection',
            members,
            currentUser: req.member
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error');
        res.redirect('/');
    }
};

module.exports = {
    getAllMembers
};