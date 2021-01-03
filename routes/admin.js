const express = require('express');
const router = express.Router()
const controller = require('../controllers/adminController')

router.get('/announcement', controller.getAnnoucement)
router.post('/announcement', controller.addAnnouncement)

module.exports = router