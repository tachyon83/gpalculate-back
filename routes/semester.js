const express = require('express');
const router = express.Router()
const controller = require('../controllers/semesterController')

router.get('/', controller.getSemester)
router.post('/', controller.addSemester)
router.put('/', controller.saveSemester)
router.delete('/', controller.deleteSemester)

module.exports = router