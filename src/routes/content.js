const express = require('express')
const { body, validationResult } = require('express-validator')
const authenticate = require('../middleware/auth')
const { Session, Lesson, Quiz, QuizOption } = require('../models')

const router = express.Router()

// Session CRUD
router.post('/courses/:courseId/sessions',
  authenticate,
  body('title').notEmpty(),
  async (req, res) => {
    const errs = validationResult(req); if (!errs.isEmpty()) return res.status(422).json({ errors: errs.array() })
    const session = await Session.create({ 
      course_id: req.params.courseId,
      title: req.body.title,
      order_index: req.body.order_index || 0
    })
    res.status(201).json(session)
  }
)

// Lesson CRUD
router.post('/sessions/:sessionId/lessons',
  authenticate,
  body('title').notEmpty(),
  async (req, res) => {
    const lesson = await Lesson.create({
      session_id: req.params.sessionId,
      title: req.body.title,
      content: req.body.content,
      video_url: req.body.video_url,
      duration: req.body.duration
    })
    res.status(201).json(lesson)
  }
)

// Quiz CRUD
router.post('/lessons/:lessonId/quizzes',
  authenticate,
  body('question').notEmpty(),
  async (req, res) => {
    const quiz = await Quiz.create({
      lesson_id: req.params.lessonId,
      question: req.body.question
    })
    res.status(201).json(quiz)
  }
)

// 4. QuizOption CRUD
router.post('/quizzes/:quizId/options',
  authenticate,
  body('option_text').notEmpty(),
  async (req, res) => {
    const opt = await QuizOption.create({
      quiz_id: req.params.quizId,
      option_text: req.body.option_text,
      is_correct: req.body.is_correct || false
    })
    res.status(201).json(opt)
  }
)

module.exports = router
