// src/controllers/quizzes.js
const { Quiz, QuizOption, Lesson, UserQuizAnswer } = require('../models')

// ─── Ambil semua quiz + opsi ─────────────────────────────────────
async function getAllQuizzes(req, res) {
  try {
    const quizzes = await Quiz.findAll({
      include: [{ model: QuizOption, as: 'options' }],
      order: [['lesson_id', 'ASC'], ['order', 'ASC']]
    })
    res.json(quizzes)
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil quiz', detail: err.message })
  }
}

// ─── Ambil 1 quiz + opsi + submission user ───────────────────────
async function getQuizById(req, res) {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [{ model: QuizOption, as: 'options' }]
    })
    if (!quiz) return res.status(404).json({ error: 'Quiz tidak ditemukan' })

    const answer = await UserQuizAnswer.findOne({
      where: { user_id: req.user.id, quiz_id: quiz.id }
    })

    const q = quiz.toJSON()
    q.userSubmission = {
      selectedOptionId: answer?.quiz_option_id || null,
      isCorrect:        answer?.is_correct       || null
    }

    res.json(q)
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil quiz', detail: err.message })
  }
}

// ─── Ambil submission user untuk 1 quiz ─────────────────────────
async function getSubmission(req, res) {
  try {
    const quizId = req.params.id
    const userId = req.user.id

    const answer = await UserQuizAnswer.findOne({
      where: { quiz_id: quizId, user_id: userId }
    })

    res.json({
      selectedOptionId: answer?.quiz_option_id || null,
      isCorrect:        answer?.is_correct       || null
    })
  } catch (err) {
    res.status(500).json({ error: 'Gagal ambil submission', detail: err.message })
  }
}

// ─── Ambil semua quiz per lesson + submission user ─────────────
async function getQuizzesByLesson(req, res) {
  try {
    const quizzes = await Quiz.findAll({
      where: { lesson_id: req.params.lessonId },
      include: [{ model: QuizOption, as: 'options' }],
      order: [['order', 'ASC']]
    })

    const userId  = req.user.id
    const quizIds = quizzes.map(q => q.id)
    const answers = await UserQuizAnswer.findAll({
      where: { user_id: userId, quiz_id: quizIds }
    })

    const answersMap = {}
    answers.forEach(a => { answersMap[a.quiz_id] = a.quiz_option_id })

    const result = quizzes.map(q => {
      const qj = q.toJSON()
      qj.userSubmission = {
        selectedOptionId: answersMap[q.id] || null,
        isCorrect:        answers.find(a => a.quiz_id === q.id)?.is_correct || null
      }
      return qj
    })

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'Gagal ambil quiz per lesson', detail: err.message })
  }
}

// ─── Buat quiz baru + opsi (admin) ──────────────────────────────
async function createQuiz(req, res) {
  const { lesson_id, question, options, correct_option_index } = req.body
  try {
    const lesson = await Lesson.findByPk(lesson_id)
    if (!lesson) return res.status(404).json({ error: 'Lesson tidak ditemukan' })

    const count = await Quiz.count({ where: { lesson_id } })
    const quiz  = await Quiz.create({ lesson_id, question, order: count + 1 })

    await Promise.all(options.map((text, idx) =>
      QuizOption.create({
        quiz_id:     quiz.id,
        option_text: text,
        is_correct:  idx === correct_option_index
      })
    ))

    const full = await Quiz.findByPk(quiz.id, {
      include: [{ model: QuizOption, as: 'options' }]
    })
    res.status(201).json(full)

  } catch (err) {
    res.status(400).json({ error: 'Gagal buat quiz', detail: err.message })
  }
}

// ─── Update pertanyaan quiz (admin) ────────────────────────────
async function updateQuiz(req, res) {
  const { question } = req.body
  try {
    const quiz = await Quiz.findByPk(req.params.id)
    if (!quiz) return res.status(404).json({ error: 'Quiz tidak ditemukan' })

    await quiz.update({ question })
    res.json(quiz)
  } catch (err) {
    res.status(400).json({ error: 'Gagal update quiz', detail: err.message })
  }
}

// ─── Hapus quiz + opsi (admin) ─────────────────────────────────
async function deleteQuiz(req, res) {
  try {
    const quiz = await Quiz.findByPk(req.params.id)
    if (!quiz) return res.status(404).json({ error: 'Quiz tidak ditemukan' })

    await QuizOption.destroy({ where: { quiz_id: quiz.id } })
    await quiz.destroy()
    res.json({ message: 'Quiz berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ error: 'Gagal hapus quiz', detail: err.message })
  }
}

// ─── Submit jawaban, simpan & balikin isCorrect ────────────────
async function submitOption(req, res) {
  try {
    const quizId   = req.params.id
    const optionId = req.params.optionId
    const userId   = req.user.id

    // validasi opsi
    const opt = await QuizOption.findOne({
      where: { id: optionId, quiz_id: quizId }
    })
    if (!opt) return res.status(404).json({ error: 'Opsi tidak ditemukan' })

    // upsert jawaban
    await UserQuizAnswer.upsert({
      user_id:        userId,
      quiz_id:        quizId,
      quiz_option_id: opt.id,
      is_correct:     opt.is_correct
    })

    // balikin response yang dipakai frontend
    res.json({
      selectedOptionId: opt.id,
      isCorrect:        opt.is_correct
    })
  } catch (err) {
    console.error('❌ Gagal simpan jawaban quiz:', err)
    res.status(500).json({ error: 'Gagal simpan jawaban', detail: err.message })
  }
}

module.exports = {
  getAllQuizzes,
  getQuizById,
  getSubmission,
  getQuizzesByLesson,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitOption
}
