// src/controllers/LessonProgress.js
const { LessonProgress, Lesson, Session, Enrollment } = require('../models')

// Helper: hitung total lesson di course
async function getTotalLessons(courseId) {
  return Lesson.count({
    include: [{
      model: Session,
      as: 'session',
      where: { course_id: courseId },
      attributes: []
    }]
  })
}

// Helper: hitung watched & completed untuk user
async function getLessonCounts(userId, courseId) {
  const baseInclude = {
    model: Lesson,
    as: 'lesson',
    include: {
      model: Session,
      as: 'session',
      where: { course_id: courseId },
      attributes: []
    }
  }

  const watched   = await LessonProgress.count({ where: { user_id: userId, watched: true },   include: [ baseInclude ] })
  const completed = await LessonProgress.count({ where: { user_id: userId, completed: true }, include: [ baseInclude ] })
  return { watched, completed }
}

// ✍️ Tandai lesson sudah ditonton
// POST /api/lesson‑progress
// body: { courseId, sessionId, lessonId }
exports.markLessonWatched = async (req, res) => {
  try {
    const userId   = req.user.id
    const { courseId, lessonId } = req.body

    // Validasi ownership
    const lesson = await Lesson.findByPk(lessonId, { include: { model: Session, as: 'session' } })
    if (!lesson || lesson.session.course_id !== courseId) {
      return res.status(400).json({ success: false, message: 'Materi tidak valid untuk course ini' })
    }

    // Buat/Update LessonProgress
    const [progress] = await LessonProgress.findOrCreate({
      where: { user_id: userId, lesson_id: lessonId },
      defaults: { watched: true, completed: false }
    })
    if (!progress.watched) await progress.update({ watched: true })

    // Hitung progress % dan simpan ke Enrollment
    const total     = await getTotalLessons(courseId)
    const { watched, completed } = await getLessonCounts(userId, courseId)
    const percent   = total ? Math.floor(Math.max(watched, completed) / total * 100) : 0

    await Enrollment.update(
      { progress: percent },
      { where: { user_id: userId, course_id: courseId } }
    )

    res.json({ success: true, message: 'Materi ditandai sebagai sudah ditonton', progress: percent })
  } catch (err) {
    console.error('❌ markLessonWatched error:', err)
    res.status(500).json({ success: false, message: 'Gagal menandai materi ditonton' })
  }
}

// ✍️ Tandai quiz lesson selesai
// POST /api/lesson‑progress/quiz-complete
// body: { courseId, sessionId, lessonId }
exports.markLessonQuizComplete = async (req, res) => {
  try {
    const userId   = req.user.id
    const { courseId, lessonId } = req.body

    const lesson = await Lesson.findByPk(lessonId, { include: { model: Session, as: 'session' } })
    if (!lesson || lesson.session.course_id !== courseId) {
      return res.status(400).json({ success: false, message: 'Materi tidak valid untuk course ini' })
    }

    const [progress] = await LessonProgress.findOrCreate({
      where: { user_id: userId, lesson_id: lessonId },
      defaults: { watched: true, completed: true }
    })
    if (!progress.completed) await progress.update({ completed: true })

    const total     = await getTotalLessons(courseId)
    const { watched, completed } = await getLessonCounts(userId, courseId)
    const percent   = total ? Math.floor(Math.max(watched, completed) / total * 100) : 0

    await Enrollment.update(
      { progress: percent },
      { where: { user_id: userId, course_id: courseId } }
    )

    res.json({ success: true, message: 'Kuis materi ditandai selesai', progress: percent })
  } catch (err) {
    console.error('❌ markLessonQuizComplete error:', err)
    res.status(500).json({ success: false, message: 'Gagal menandai kuis selesai' })
  }
}
