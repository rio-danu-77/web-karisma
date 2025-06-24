const { Session } = require('../models');

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.findAll();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil sessions' });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session tidak ditemukan' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil session' });
  }
};

exports.createSession = async (req, res) => {
  try {
    const { course_id, title, order_index } = req.body;
    const newSession = await Session.create({ course_id, title, order_index });
    res.status(201).json(newSession);
  } catch (err) {
    res.status(400).json({ error: 'Gagal membuat session', detail: err.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session tidak ditemukan' });

    const updates = {};
    ['course_id','title','order_index'].forEach(f => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    await session.update(updates);
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: 'Gagal mengupdate session', detail: err.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session tidak ditemukan' });
    await session.destroy();
    res.json({ message: 'Session berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus session' });
  }
};
