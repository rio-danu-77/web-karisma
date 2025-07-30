// src/routes/quizzes.js
const express = require('express')
const { body, validationResult } = require('express-validator')
const auth = require('../middleware/auth')
const ctrl = require('../controllers/quizzes')

const router = express.Router()

router.get('/',            auth, ctrl.getAllQuizzes)
router.get('/:id',         auth, ctrl.getQuizById)

// GET semua quiz dalam 1 lesson (dipakai CourseContent.jsx)
router.get('/lesson/:lessonId', auth, ctrl.getQuizzesByLesson)

// GET submission user untuk 1 quiz (biar state “nempel” pas refresh)
router.get('/:id/submission', auth, ctrl.getSubmission)

// POST submit jawaban user → save & return `{ selectedOptionId, isCorrect }`
router.post('/:id/submit/:optionId', auth, ctrl.submitOption)


router.post(
  '/',
  auth,
  body('lesson_id').isInt().withMessage('lesson_id harus berupa angka'),
  body('question').notEmpty().withMessage('Pertanyaan wajib diisi'),
  body('options').isArray({ min: 2 }).withMessage('Opsi minimal 2'),
  body('correct_option_index').isInt().withMessage('Index jawaban benar wajib angka'),
  (req, res, next) => {
    const errs = validationResult(req)
    if (!errs.isEmpty()) {
      return res.status(422).json({ errors: errs.array() })
    }
    next()
  },
  ctrl.createQuiz
)

// Update pertanyaan quiz
router.put(
  '/:id',
  auth,
  body('question').notEmpty().withMessage('Pertanyaan tidak boleh kosong'),
  (req, res, next) => {
    const errs = validationResult(req)
    if (!errs.isEmpty()) {
      return res.status(422).json({ errors: errs.array() })
    }
    next()
  },
  ctrl.updateQuiz
)

// Hapus quiz + semua opsinya
router.delete('/:id', auth, ctrl.deleteQuiz)


module.exports = router
