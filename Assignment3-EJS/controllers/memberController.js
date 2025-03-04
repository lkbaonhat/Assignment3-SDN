const Member = require('../models/member');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const isMemberExist = async (username) => {
    const memberData = await Member.findOne
        ({
            username: username
        })
    return memberData
}

const getAll = (req, res) => {
    try {
        const memberData = Member.find()
        memberData.then((memberData) => {
            res.status(200).json(memberData)
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}

const register = (req, res) => {
    const { username, password } = req.body;
    let errors = [];
    try {
        if (!username || !password) {
            errors.push({ message: 'Please fill all fields' })
        }
        if (password.length < 6) {
            errors.push({ message: 'Password should be at least 6 characters' })
        }
        if (errors.length > 0) {
            res.render('register', {
                errors,
                username,
                password
            })
        } else {
            const memberData = isMemberExist(username)
            if (memberData) {
                errors.push({ message: 'Username already registered' })
                res.render('register', {
                    errors,
                    username,
                    password
                })
            } else {
                const hashPassword = bcrypt.hash(password, 10)
                const newMember = Member({ username, hashPassword })
                newMember.save()
                    .then((newMember) => {
                        res.status(201).json(newMember)
                        res.redirect('/login')
                    })
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getAll, register }