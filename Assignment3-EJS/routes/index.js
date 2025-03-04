var express = require('express');
var router = express.Router();
const perfumeController = require('../controllers/perfumeController');

/* GET home page. */
router.route('/')
  .get(perfumeController.getAllPerfumesHomePage)

router.route('/:perfumeID')
  .get(perfumeController.getDetailPerfumeHomePage)

module.exports = router;
