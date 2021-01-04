const express = require('express');
const router = express.Router()
const controller = require('../controllers/adminController')

router.get('/user', controller.getUserTotal)
router.get('/user/list', controller.getUserList)
router.get('/user/:email', controller.getUserDetail)
router.delete('/user', controller.deleteUser)
router.post('/conversion', controller.addConversion)
router.get('/announcement', controller.getAnnoucement)
router.post('/announcement', controller.addAnnouncement)

module.exports = router