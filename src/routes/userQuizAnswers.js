const express = require('express')
const auth = require('../middleware/auth')
const controller = require('../controllers/userQuizAnswers')

const router = express.Router()

router.post('/:lessonId/answer', auth, controller.submitAnswer)

module.exports = router
