const memberController = require('../controllers/memberController');
const express = require('express');
const memberRouter = express.Router();

memberRouter.route('/')
  .get(memberController.getAll)
  .post(memberController.register)

module.exports = memberRouter;
