const {
  Lesson,
  Session,
  Quiz,
  QuizOption,
  UserQuizAnswer,
  LessonProgress,
  Enrollment
} = require('../models')
const { Op } = require('sequelize')

// Helper: Hitung dan update progress user dalam course
async function recalcAndSaveProgress(userId, courseId) {
  // Hitung total lesson di course
  const totalLessons = await Lesson.count({
    include: [{
      model: Session,
      as: 'session',
      where: { course_id: courseId },
      attributes: []
    }]
  })

  // Hitung lesson yang sudah ditandai watched atau completed user
  const doneLessons = await LessonProgress.count({
    where: {
      user_id: userId,
      [Op.or]: [{ watched: true }, { completed: true }]
    },
    include: [{
      model: Lesson,
      as: 'lesson', // pastikan alias 'lesson' sesuai di relasi model
      include: {
        model: Session,
        as: 'session',
        where: { course_id: courseId }
      }
    }]
  })

  // Hitung progress persen, pakai pembulatan
  const percent = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0

  // Update progress di tabel Enrollment
  await Enrollment.update(
    { progress: percent },
    { where: { user_id: userId, course_id: courseId } }
  )

  return percent
}

// 1. Get semua lesson dalam satu session
exports.listForSession = async (req, res) => {
  const sessionId = parseInt(req.params.sessionId, 10)
  if (isNaN(sessionId)) return res.status(400).json({ message: 'sessionId tidak valid' })

  try {
    const session = await Session.findByPk(sessionId)
    if (!session) return res.status(404).json({ message: 'Sesi tidak ditemukan' })

    const lessons = await Lesson.findAll({
      where: { session_id: sessionId },
      order: [['order_number', 'ASC']]
    })

    return res.json(lessons)
  } catch (err) {
    console.error('❌ Gagal mengambil materi:', err)
    return res.status(500).json({ message: 'Gagal mengambil materi', detail: err.message })
  }
}

// 2. Get detail satu lesson + quiz + jawaban user
exports.getLessonDetail = async (req, res) => {
  const userId = req.user.id
  const lessonId = parseInt(req.params.lessonId, 10)
  if (isNaN(lessonId)) return res.status(400).json({ message: 'lessonId tidak valid' })

  try {
    const lesson = await Lesson.findByPk(lessonId)
    if (!lesson) return res.status(404).json({ message: 'Materi tidak ditemukan' })

    const quizzes = await Quiz.findAll({
      where: { lesson_id: lessonId },
      include: [{ model: QuizOption, as: 'options' }],
      order: [['order', 'ASC'], [{ model: QuizOption, as: 'options' }, 'id', 'ASC']]
    })

    // Ambil jawaban user untuk semua quiz di lesson ini
    const quizIds = quizzes.map(q => q.id)
    const answers = await UserQuizAnswer.findAll({
      where: {
        user_id: userId,
        quiz_id: { [Op.in]: quizIds }
      }
    })

    // Map quiz_id ke jawaban user
    const ansMap = Object.fromEntries(answers.map(a => [a.quiz_id, a]))

    // Gabungkan quiz dengan jawaban user dan status benar/salah
    const quizzesWithUserAnswer = quizzes.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      userAnswerId: ansMap[q.id]?.quiz_option_id || null,
      isCorrect: ansMap[q.id]?.is_correct ?? null
    }))

    const result = lesson.toJSON()
    result.quizzes = quizzesWithUserAnswer

    return res.json(result)
  } catch (err) {
    console.error('❌ Gagal mengambil detail materi:', err)
    return res.status(500).json({ message: 'Gagal mengambil detail materi', detail: err.message })
  }
}

// 3. Buat lesson baru
exports.createForSession = async (req, res) => {
  const sessionId = parseInt(req.params.sessionId, 10)
  const { title, content = '', video_url = null } = req.body

  if (isNaN(sessionId)) return res.status(400).json({ message: 'sessionId tidak valid' })

  try {
    if (!title?.trim()) return res.status(400).json({ message: 'Judul materi wajib diisi' })

    const session = await Session.findByPk(sessionId)
    if (!session) return res.status(404).json({ message: 'Sesi tidak ditemukan' })

    // Cari urutan materi terakhir di session ini
    const maxOrder = (await Lesson.max('order_number', {
      where: { session_id: sessionId }
    })) || 0

    const lesson = await Lesson.create({
      session_id: sessionId,
      title,
      content,
      video_url,
      order_number: maxOrder + 1
    })

    return res.status(201).json(lesson)
  } catch (err) {
    console.error('❌ Gagal membuat materi:', err)
    return res.status(500).json({ message: 'Gagal membuat materi', detail: err.message })
  }
}

// 4. Tandai sebagai ditonton
exports.markLessonWatched = async (req, res) => {
  const userId = req.user.id
  const lessonId = parseInt(req.params.lessonId, 10)
  if (isNaN(lessonId)) return res.status(400).json({ message: 'lessonId tidak valid' })

  try {
    const lesson = await Lesson.findByPk(lessonId, {
      include: { model: Session, as: 'session', attributes: ['course_id'] }
    })

    if (!lesson) return res.status(404).json({ message: 'Lesson tidak ditemukan' })

    const courseId = lesson.session?.course_id
    if (!courseId) return res.status(400).json({ message: 'Course ID tidak ditemukan' })

    const [progress] = await LessonProgress.findOrCreate({
      where: { user_id: userId, lesson_id: lessonId },
      defaults: { watched: true }
    })

    if (!progress.watched) {
      progress.watched = true
      await progress.save()
    }

    const newPct = await recalcAndSaveProgress(userId, courseId)
    return res.json({ message: 'Lesson ditandai ditonton', progress: newPct })
  } catch (err) {
    console.error('❌ Error markLessonWatched:', err)
    return res.status(500).json({ message: 'Gagal menandai watched', detail: err.message })
  }
}

// 5. Tandai quiz selesai
exports.markQuizCompleted = async (req, res) => {
  const userId = req.user.id
  const lessonId = parseInt(req.params.lessonId, 10)
  if (isNaN(lessonId)) return res.status(400).json({ message: 'lessonId tidak valid' })

  try {
    const lesson = await Lesson.findByPk(lessonId, {
      include: { model: Session, as: 'session', attributes: ['course_id'] }
    })

    if (!lesson) return res.status(404).json({ message: 'Lesson tidak ditemukan' })

    const courseId = lesson.session?.course_id
    if (!courseId) return res.status(400).json({ message: 'Course ID tidak ditemukan' })

    const [progress] = await LessonProgress.findOrCreate({
      where: { user_id: userId, lesson_id: lessonId },
      defaults: { completed: true }
    })

    if (!progress.completed) {
      progress.completed = true
      await progress.save()
    }

    const newPct = await recalcAndSaveProgress(userId, courseId)
    return res.json({ message: 'Quiz ditandai selesai', progress: newPct })
  } catch (err) {
    console.error('❌ Error markQuizCompleted:', err)
    return res.status(500).json({ message: 'Gagal menandai quiz selesai', detail: err.message })
  }
}
