// src/routes/lessons.js
const express = require('express')
const router = express.Router({ mergeParams: true })

const lessonsController = require('../controllers/lessons')
const auth = require('../middleware/auth')
const { body, param } = require('express-validator')

// GET: Ambil semua lesson dalam satu session
router.get(
  '/',
  auth,
  lessonsController.listForSession
)

// GET: Ambil detail satu lesson berdasarkan lessonId
router.get(
  '/:lessonId',
  auth,
  param('lessonId').isInt().withMessage('lessonId harus berupa angka'),
  lessonsController.getLessonDetail
)

// POST: Tambah lesson baru ke dalam session (parentId-nya via params dari session)
router.post(
  '/',
  auth,
  body('title').notEmpty().withMessage('Judul materi wajib diisi'),
  body('content').optional().isString().withMessage('Konten harus berupa teks'),
  lessonsController.createForSession
)

// POST: Tandai lesson sebagai "sudah ditonton" oleh user
router.post(
  '/:lessonId/watch',
  auth,
  param('lessonId').isInt().withMessage('lessonId harus berupa angka'),
  lessonsController.markLessonWatched
)

// PATCH: Tandai bahwa user sudah menyelesaikan quiz dalam lesson tersebut
router.patch(
  '/:lessonId/quiz-completed',
  auth,
  param('lessonId').isInt().withMessage('lessonId harus berupa angka'),
  lessonsController.markQuizCompleted
)

module.exports = router
