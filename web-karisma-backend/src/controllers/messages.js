const { Message } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const msgs = await Message.findAll();
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil messages' });
  }
};

exports.getById = async (req, res) => {
  try {
    const m = await Message.findByPk(req.params.id);
    if (!m) return res.status(404).json({ error: 'Message tidak ditemukan' });
    res.json(m);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil message' });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      sender_id, receiver_id, course_id,
      subject, body, status, sent_at
    } = req.body;
    const newM = await Message.create({
      sender_id, receiver_id, course_id,
      subject, body, status, sent_at
    });
    res.status(201).json(newM);
  } catch (err) {
    res.status(400).json({ error: 'Gagal membuat message', detail: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const m = await Message.findByPk(req.params.id);
    if (!m) return res.status(404).json({ error: 'Message tidak ditemukan' });
    const updates = {};
    ['sender_id','receiver_id','course_id','subject','body','status','sent_at']
      .forEach(f => { if (req.body[f]!==undefined) updates[f]=req.body[f] });
    await m.update(updates);
    res.json(m);
  } catch (err) {
    res.status(400).json({ error: 'Gagal mengupdate message', detail: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const m = await Message.findByPk(req.params.id);
    if (!m) return res.status(404).json({ error: 'Message tidak ditemukan' });
    await m.destroy();
    res.json({ message: 'Message berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus message' });
  }
};
