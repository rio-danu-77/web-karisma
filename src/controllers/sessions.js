// src/controllers/sessions.js
const { Session, Lesson, Course } = require('../models')

// GET /api/courses/:courseId/sessions
exports.getSessionsByCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId, 10)
    const course = await Course.findByPk(courseId)
    if (!course) {
      return res.status(404).json({ message: 'Kursus tidak ditemukan' })
    }

    const sessions = await Session.findAll({
      where: { course_id: courseId },
      include: [
        {
          model: Lesson,
          as: 'lessons',
          separate: true,
          order: [['order_number', 'ASC']]
        }
      ],
      order: [['order_index', 'ASC']]
    })

    return res.json(sessions)
  } catch (err) {
    console.error('❌ Gagal mengambil sesi kursus:', err)
    return res.status(500).json({
      message: 'Gagal mengambil sesi kursus',
      detail: err.message
    })
  }
}

// POST /api/courses/:courseId/sessions
exports.createSession = async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId, 10)
    const { title } = req.body

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Judul sesi wajib diisi' })
    }

    const course = await Course.findByPk(courseId)
    if (!course) {
      return res.status(404).json({ message: 'Kursus tidak ditemukan' })
    }

    const maxOrder =
      (await Session.max('order_index', { where: { course_id: courseId } })) ||
      0

    const newSession = await Session.create({
      course_id: courseId,
      title,
      order_index: maxOrder + 1
    })

    return res.status(201).json(newSession)
  } catch (err) {
    console.error('❌ Gagal membuat sesi:', err)
    return res.status(500).json({
      message: 'Gagal membuat sesi',
      detail: err.message
    })
  }
}

// Helper: cari session yang milik course
exports.findSession = async (sessionId, courseId) => {
  return await Session.findOne({
    where: { id: sessionId, course_id: courseId }
  })
}
