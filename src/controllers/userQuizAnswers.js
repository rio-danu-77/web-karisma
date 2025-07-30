// Simpan jawaban user ke DB
const { UserQuizAnswer } = require('../models')

exports.submitAnswer = async (req, res) => {
  const userId   = req.user.id
  const { quiz_id, quiz_option_id } = req.body

  try {
    const isCorrect = await checkIsCorrect(quiz_id, quiz_option_id)

    await UserQuizAnswer.upsert({
      user_id: userId,
      quiz_id,
      quiz_option_id,
      is_correct: isCorrect
    })

    return res.json({ message: 'Jawaban disimpan', isCorrect })
  } catch (err) {
    console.error('❌ Gagal menyimpan jawaban:', err)
    return res.status(500).json({ message: 'Gagal menyimpan jawaban' })
  }
}
