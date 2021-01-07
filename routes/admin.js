const express = require('express');
const router = express.Router()
const controller = require('../controllers/adminController')

router.get('/user', controller.getUserTotal)
router.get('/user/list', controller.getUserList)
router.get('/user/:keyword', controller.findUserByKeyword)
router.delete('/user', controller.deleteUser)
router.post('/conversion', controller.addConversion)
router.post('/announcement', controller.addAnnouncement)

module.exports = router