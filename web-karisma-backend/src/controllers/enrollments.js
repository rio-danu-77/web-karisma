const { Enrollment } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await Enrollment.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil enrollments' });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Enrollment.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Enrollment tidak ditemukan' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil enrollment' });
  }
};

exports.create = async (req, res) => {
  try {
    const { user_id, course_id, status, enrolled_at, completed_at } = req.body;
    const newItem = await Enrollment.create({ user_id, course_id, status, enrolled_at, completed_at });
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: 'Gagal membuat enrollment', detail: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await Enrollment.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Enrollment tidak ditemukan' });
    const updates = {};
    ['user_id','course_id','status','enrolled_at','completed_at']
      .forEach(f => { if (req.body[f]!==undefined) updates[f]=req.body[f] });
    await item.update(updates);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: 'Gagal mengupdate enrollment', detail: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const item = await Enrollment.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Enrollment tidak ditemukan' });
    await item.destroy();
    res.json({ message: 'Enrollment berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus enrollment' });
  }
};
