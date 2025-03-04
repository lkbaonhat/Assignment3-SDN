function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

function checkRole() {
    return function (req, res, next) {
        if (req.isAuthenticated() && req.user.isAdmin) {
            return next();
        } else {
            res.status(403).send('Forbidden');
        }
    }
}

module.exports = {
    ensureAuthenticated,
    checkRole
};