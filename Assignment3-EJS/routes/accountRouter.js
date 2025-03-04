const accountController = require('../controllers/accountController')
const express = require('express')
const accountRouter = express.Router()

accountRouter.route('/')
    .get(accountController.register)
    .post(accountController.signUp)

accountRouter.route('/login')
    .get(accountController.login)
    .post(accountController.signIn)
module.exports = accountRouter