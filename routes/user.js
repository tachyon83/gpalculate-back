const express = require('express');
const router = express.Router()
const controller = require('../controllers/userController')
const authMiddleware = require('../utils/authMiddleware')

router.post('/', controller.register)
router.get('/help', authMiddleware, controller.help)
router.get('/', authMiddleware, controller.detail)
router.put('/', authMiddleware, controller.modify)
router.post('/login', controller.login)


module.exports = router