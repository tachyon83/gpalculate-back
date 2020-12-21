const express = require('express');
const router = express.Router()
const controller = require('../controllers/userController')

const logMiddleware = (req, res, next) => {
    console.log('entered')
    next()
}

router.post('/', logMiddleware, controller.register)
router.post('/login', logMiddleware, controller.login)

module.exports = router