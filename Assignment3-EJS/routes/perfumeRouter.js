const perfumeController = require('../controllers/perfumeController');
const express = require('express');
const perfumeRouter = express.Router();

perfumeRouter.route('/')
    .get(perfumeController.getAllPerfumes)
    .post(perfumeController.addPerfume)

perfumeRouter.route('/:perfumeID')
    .get(perfumeController.getDetailPerfume)

perfumeRouter.route('/:perfumeID/edit')
    .get(perfumeController.getDetailPerfume)
    .post(perfumeController.updatePerfume)

perfumeRouter.route('/delete/:perfumeID')
    .get(perfumeController.deletePerfume)

module.exports = perfumeRouter