const { AssignmentSubmission } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await AssignmentSubmission.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data submissions' });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await AssignmentSubmission.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Submission tidak ditemukan' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil submission' });
  }
};

exports.create = async (req, res) => {
  try {
    const { assignment_id, user_id, submission_file_url, submitted_at } = req.body;
    const created = await AssignmentSubmission.create({
      assignment_id,
      user_id,
      submission_file_url,
      submitted_at
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: 'Gagal membuat submission', detail: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await AssignmentSubmission.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Submission tidak ditemukan' });

    const { assignment_id, user_id, submission_file_url, submitted_at } = req.body;
    await item.update({
      assignment_id,
      user_id,
      submission_file_url,
      submitted_at
    });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: 'Gagal mengupdate submission', detail: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const item = await AssignmentSubmission.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Submission tidak ditemukan' });

    await item.destroy();
    res.json({ message: 'Submission berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus submission' });
  }
};
