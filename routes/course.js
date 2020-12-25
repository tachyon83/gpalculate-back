const express = require('express');
const router = express.Router()
const controller = require('../controllers/courseController')

router.post('/', controller.addCourse)
router.put('/', controller.modifyCourse)
router.delete('/', controller.deleteCourse)

module.exports = router