const express = require('express');
const router = express.Router()
const controller = require('../controllers/conversionController')

router.get('/', controller.getConversion)

module.exports = router