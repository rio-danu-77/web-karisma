// src/routes/courses.js
const express                   = require('express')
const multer                    = require('multer')
const { body, validationResult } = require('express-validator')
const authOptional              = require('../middleware/authOptional')
const authenticate              = require('../middleware/auth')
const courseController          = require('../controllers/courses')
const sessionController         = require('../controllers/sessions')
const lessonController          = require('../controllers/lessons')

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

// — Public endpoints —
router.get('/',         authOptional, courseController.list)
router.get('/:id/full', authOptional, courseController.full)
router.get('/:id',      authOptional, courseController.show)

// — Protected from here on —
router.use(authenticate)

// Sessions nested under a course
router.route('/:courseId/sessions')
  .get(sessionController.getSessionsByCourse)    // Sesuai export di controllers/sessions.js
  .post(sessionController.createSession)        // Sesuai export di controllers/sessions.js

// Lessons nested under a session
router.route('/:courseId/sessions/:sessionId/lessons')
  .get(lessonController.listForSession)         // Sesuai export di controllers/lessons.js
  .post(lessonController.createForSession)      // Sesuai export di controllers/lessons.js

// Single-lesson detail endpoint
router.get(
  '/:courseId/sessions/:sessionId/lessons/:lessonId',
  lessonController.getLessonDetail               // Sesuai export di controllers/lessons.js
)

// — Validation rules for create/update course —
const courseValidations = [
  body('title').trim().notEmpty().withMessage('Judul wajib diisi'),
  body('category_id').optional().isInt().withMessage('Kategori harus angka'),
  body('price').isDecimal().withMessage('Harga tidak valid'),
  body('status').isIn(['active','inactive']).withMessage('Status tidak valid'),
  body('start_date').optional().isISO8601().withMessage('Tanggal mulai tidak valid'),
  body('end_date').optional().isISO8601().withMessage('Tanggal selesai tidak valid'),
]

// Create a new course
router.post(
  '/',
  upload.single('thumbnail'),
  courseValidations,
  (req, res, next) => {
    const errs = validationResult(req)
    if (!errs.isEmpty()) return res.status(422).json({ errors: errs.array() })
    next()
  },
  courseController.create
)

// Update an existing course
router.put(
  '/:id',
  upload.single('thumbnail'),
  courseValidations,
  (req, res, next) => {
    const errs = validationResult(req)
    if (!errs.isEmpty()) return res.status(422).json({ errors: errs.array() })
    next()
  },
  courseController.update
)

// Delete a course
router.delete('/:id', courseController.destroy)

module.exports = router
