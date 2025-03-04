const mongoose = require('mongoose')
const Member = require('../models/member');
const bcrypt = require('bcrypt')

const register = (req, res) => {
    try {
        res.render('register')
    } catch (error) {
        res.json({ message: error.message })
    }
}

const login = (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        res.json({ message: error.message })
    }
}

const signUp = (req, res, next) => {
    try {
        const { email, password } = req.body;
        let errors = [];
        if (!email || !password) {
            errors.push({ msg: 'Please enter all fields' });
        }
        if (password.length < 6) {
            errors.push({ msg: 'Password must be at least 6 characters' });
        }
        if (errors.length > 0) {
            res.render('register', {
                errors,
                email,
                password
            });
        }
        else {
            Member.findOne({ email: email }).then(user => {
                if (user) {
                    errors.push({ msg: 'Username already exists' });
                    res.render('register', {
                        errors,
                        email,
                        password
                    });
                }
                else {
                    const newUser = new Member({
                        email,
                        password
                    });
                    //Hash password
                    bcrypt.hash(newUser.password, 10, function (err, hash) {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                res.redirect('/auth/login');
                            })
                            .catch(next);
                    });
                }
            });
        }

    } catch (error) {
        res.json({ message: error.message })

    }
}

const signIn = (req, res, next) => {
    try {
        const { email, password } = req.body;
        let errors = [];
        if (!email || !password) {
            errors.push({ msg: 'Please enter all fields' });
        }
        if (errors.length > 0) {
            res.render('login', {
                errors,
                email,
                password
            });
        }
        else {
            Member.findOne({ email: email }).then(user => {
                if (!user) {
                    errors.push({ msg: 'User not found' });
                    res.render('login', {
                        errors,
                        email,
                        password
                    });
                }
                else {
                    bcrypt.compare(password, user.password, function (err, result) {
                        if (err) throw err;
                        if (result) {
                            res.redirect('/members')
                        } else {
                            errors.push({ msg: 'Password incorrect' });
                            res.render('login', {
                                errors,
                                email,
                                password
                            });
                        }
                    });
                }
            });
        }

    } catch (error) {
        res.json({ message: error.message })

    }
}

module.exports = { register, login, signUp, signIn }