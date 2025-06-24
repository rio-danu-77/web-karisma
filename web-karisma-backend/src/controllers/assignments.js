const { Assignment } = require('../models');

exports.getAllAssignments = async (req, res) => {
  try {
    const data = await Assignment.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data assignments' });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment tidak ditemukan' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil assignment' });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const { course_id, question } = req.body;
    const created = await Assignment.create({ course_id, question });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: 'Gagal membuat assignment', detail: err.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment tidak ditemukan' });

    const { course_id, question } = req.body;
    await assignment.update({ course_id, question });
    res.json(assignment);
  } catch (err) {
    res.status(400).json({ error: 'Gagal mengupdate assignment', detail: err.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment tidak ditemukan' });

    await assignment.destroy();
    res.json({ message: 'Assignment berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus assignment' });
  }
};
