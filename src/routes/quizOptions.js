// src/routes/quizOptions.js
const express = require('express')
const { body, validationResult } = require('express-validator')
const auth = require('../middleware/auth')
const ctrl = require('../controllers/quizOptions')

const router = express.Router()

router.get('/', auth, ctrl.getAllQuizOptions)
router.get('/:id', auth, ctrl.getQuizOptionById)

router.post(
  '/',
  auth,
  body('quiz_id').isInt().withMessage('quiz_id harus angka'),
  body('option_text').notEmpty().withMessage('option_text wajib diisi'),
  body('is_correct').isBoolean().withMessage('is_correct harus boolean'),
  body('order').optional().isInt().withMessage('order harus angka'),
  (req, res, next) => {
    const errs = validationResult(req)
    if (!errs.isEmpty()) return res.status(422).json({ errors: errs.array() })
    next()
  },
  ctrl.createQuizOption
)

router.put(
  '/:id',
  auth,
  body('quiz_id').optional().isInt().withMessage('quiz_id harus angka'),
  body('option_text').optional().notEmpty().withMessage('option_text wajib diisi'),
  body('is_correct').optional().isBoolean().withMessage('is_correct harus boolean'),
  body('order').optional().isInt().withMessage('order harus angka'),
  (req, res, next) => {
    const errs = validationResult(req)
    if (!errs.isEmpty()) return res.status(422).json({ errors: errs.array() })
    next()
  },
  ctrl.updateQuizOption
)

router.delete('/:id', auth, ctrl.deleteQuizOption)

module.exports = router
