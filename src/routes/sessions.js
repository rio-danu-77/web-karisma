// src/routes/sessions.js
const express = require('express')
const { body, validationResult } = require('express-validator')
const auth = require('../middleware/auth')
const sessionsController = require('../controllers/sessions')
const lessonsController = require('../controllers/lessons') // controller baru untuk lesson detail

const router = express.Router({ mergeParams: true })

// GET  /api/courses/:courseId/sessions
router.get(
  '/',
  auth,
  sessionsController.getSessionsByCourse
)

// POST /api/courses/:courseId/sessions
router.post(
  '/',
  auth,
  body('title').trim().notEmpty().withMessage('Judul sesi wajib diisi'),
  (req, res, next) => {
    const errs = validationResult(req)
    if (!errs.isEmpty()) return res.status(422).json({ errors: errs.array() })
    next()
  },
  sessionsController.createSession
)

// NEW: GET single lesson
// GET /api/courses/:courseId/sessions/:sessionId/lessons/:lessonId
router.get(
  '/:sessionId/lessons/:lessonId',
  auth,
  async (req, res) => {
    try {
      const { courseId, sessionId, lessonId } = req.params

      // pastikan session ada dan milik course
      const session = await sessionsController.findSession(sessionId, courseId)
      if (!session) {
        return res.status(404).json({ message: 'Session tidak ditemukan' })
      }

      // ambil lesson
      const lesson = await lessonsController.getLessonById(sessionId, lessonId)
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson tidak ditemukan' })
      }

      res.json({ lesson })
    } catch (err) {
      console.error('Error fetching lesson:', err)
      res.status(500).json({ message: 'Gagal mengambil lesson', detail: err.message })
    }
  }
)

module.exports = router
