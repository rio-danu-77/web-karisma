const { Quiz } = require('../models');

exports.getAllQuizzes = async (req, res) => {
  try {
    const data = await Quiz.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data quiz' });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz tidak ditemukan' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil quiz' });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const { course_id, question } = req.body;
    const created = await Quiz.create({ course_id, question });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: 'Gagal membuat quiz', detail: err.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz tidak ditemukan' });

    const { course_id, question } = req.body;
    await quiz.update({ course_id, question });
    res.json(quiz);
  } catch (err) {
    res.status(400).json({ error: 'Gagal mengupdate quiz', detail: err.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz tidak ditemukan' });

    await quiz.destroy();
    res.json({ message: 'Quiz berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus quiz' });
  }
};
