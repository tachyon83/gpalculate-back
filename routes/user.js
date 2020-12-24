const express = require('express');
const router = express.Router()
const controller = require('../controllers/userController')

router.post('/', controller.register)
router.post('/login', controller.login)
router.put('/', controller.modify)

module.exports = router