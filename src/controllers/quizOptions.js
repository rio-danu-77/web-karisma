// src/controllers/quizOptions.js
const { QuizOption, Quiz } = require('../models')

// ✅ Ambil semua opsi quiz, lengkap dengan nama quiz-nya
exports.getAllQuizOptions = async (req, res) => {
  try {
    const options = await QuizOption.findAll({
      include: [{ model: Quiz, as: 'quiz', attributes: ['id', 'question'] }],
      order: [['quiz_id', 'ASC'], ['order', 'ASC'], ['id', 'ASC']]
    })
    res.json(options)
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data quiz options', detail: err.message })
  }
}

// ✅ Ambil satu opsi berdasarkan ID
exports.getQuizOptionById = async (req, res) => {
  try {
    const option = await QuizOption.findByPk(req.params.id, {
      include: [{ model: Quiz, as: 'quiz', attributes: ['id', 'question'] }]
    })
    if (!option) return res.status(404).json({ error: 'QuizOption tidak ditemukan' })
    res.json(option)
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil quiz option', detail: err.message })
  }
}

// ✅ Buat opsi baru untuk quiz tertentu
exports.createQuizOption = async (req, res) => {
  const { quiz_id, option_text, is_correct, order } = req.body
  try {
    // Validasi quiz_id wajib ada dan valid
    const quiz = await Quiz.findByPk(quiz_id)
    if (!quiz) return res.status(404).json({ error: 'Quiz tidak ditemukan' })

    const created = await QuizOption.create({ quiz_id, option_text, is_correct, order })
    res.status(201).json({ message: 'Opsi berhasil dibuat', option: created })
  } catch (err) {
    res.status(400).json({ error: 'Gagal membuat quiz option', detail: err.message })
  }
}

// ✅ Update opsi quiz
exports.updateQuizOption = async (req, res) => {
  try {
    const option = await QuizOption.findByPk(req.params.id)
    if (!option) return res.status(404).json({ error: 'QuizOption tidak ditemukan' })

    const { quiz_id, option_text, is_correct, order } = req.body

    // Optional: Validasi quiz_id baru (jika diganti)
    if (quiz_id && quiz_id !== option.quiz_id) {
      const quiz = await Quiz.findByPk(quiz_id)
      if (!quiz) return res.status(404).json({ error: 'Quiz tujuan tidak ditemukan' })
    }

    await option.update({
      quiz_id: quiz_id || option.quiz_id,
      option_text: option_text ?? option.option_text,
      is_correct: is_correct ?? option.is_correct,
      order: order ?? option.order
    })

    res.json({ message: 'QuizOption berhasil diperbarui', option })
  } catch (err) {
    res.status(400).json({ error: 'Gagal mengupdate quiz option', detail: err.message })
  }
}

// ✅ Hapus opsi quiz
exports.deleteQuizOption = async (req, res) => {
  try {
    const option = await QuizOption.findByPk(req.params.id)
    if (!option) return res.status(404).json({ error: 'QuizOption tidak ditemukan' })

    await option.destroy()
    res.json({ message: 'QuizOption berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus quiz option', detail: err.message })
  }
}
