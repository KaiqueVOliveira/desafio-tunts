var express = require('express');
var router = express.Router();
var sheetController = require('../controllers/sheetController')

/* GET home page. */
router.get('/', sheetController.viewSheet);

module.exports = router;
