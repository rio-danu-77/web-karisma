// src/routes/lessonProgress.js
const express = require('express')
const auth    = require('../middleware/auth')
const ctrl    = require('../controllers/LessonProgress')

const router = express.Router()

// Tandai lesson ditonton
router.post('/', auth, ctrl.markLessonWatched)

// Tandai quiz complete
router.post('/quiz-complete', auth, ctrl.markLessonQuizComplete)

module.exports = router
