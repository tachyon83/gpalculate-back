const express = require('express');
const router = express.Router()
const controller = require('../controllers/semesterController')

router.post('/', controller.addSemester)
router.delete('/', controller.deleteSemester)

module.exports = router