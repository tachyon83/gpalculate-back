const express = require('express');
const router = express.Router()
const controller = require('../controllers/assessmentController')

router.post('/', controller.addAssessment)
router.put('/', controller.modifyAssessment)
router.delete('/', controller.deleteAssessment)

module.exports = router