const { QuizOption } = require('../models');

exports.getAllQuizOptions = async (req, res) => {
  try {
    const data = await QuizOption.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data quiz options' });
  }
};

exports.getQuizOptionById = async (req, res) => {
  try {
    const option = await QuizOption.findByPk(req.params.id);
    if (!option) return res.status(404).json({ error: 'QuizOption tidak ditemukan' });
    res.json(option);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil quiz option' });
  }
};

exports.createQuizOption = async (req, res) => {
  try {
    const { quiz_id, option_text, is_correct } = req.body;
    const created = await QuizOption.create({ quiz_id, option_text, is_correct });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: 'Gagal membuat quiz option', detail: err.message });
  }
};

exports.updateQuizOption = async (req, res) => {
  try {
    const option = await QuizOption.findByPk(req.params.id);
    if (!option) return res.status(404).json({ error: 'QuizOption tidak ditemukan' });

    const { quiz_id, option_text, is_correct } = req.body;
    await option.update({ quiz_id, option_text, is_correct });
    res.json(option);
  } catch (err) {
    res.status(400).json({ error: 'Gagal mengupdate quiz option', detail: err.message });
  }
};

exports.deleteQuizOption = async (req, res) => {
  try {
    const option = await QuizOption.findByPk(req.params.id);
    if (!option) return res.status(404).json({ error: 'QuizOption tidak ditemukan' });

    await option.destroy();
    res.json({ message: 'QuizOption berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus quiz option' });
  }
};
