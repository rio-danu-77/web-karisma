const express = require('express')
const router = express.Router({ mergeParams: true })
const auth = require('../middleware/auth')
const controller = require('../controllers/quizAnswers')

router.post('/:lessonId', auth, controller.saveAnswer)
router.get('/:lessonId', auth, controller.getAnswers)

module.exports = router
