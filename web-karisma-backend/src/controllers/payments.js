const { Payment } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await Payment.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil payments' });
  }
};

exports.getById = async (req, res) => {
  try {
    const p = await Payment.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: 'Payment tidak ditemukan' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil payment' });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      user_id, course_id, transaction_reference,
      method, status, amount, paid_at
    } = req.body;
    const newP = await Payment.create({
      user_id, course_id, transaction_reference,
      method, status, amount, paid_at
    });
    res.status(201).json(newP);
  } catch (err) {
    res.status(400).json({ error: 'Gagal membuat payment', detail: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const p = await Payment.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: 'Payment tidak ditemukan' });
    const updates = {};
    ['user_id','course_id','transaction_reference','method','status','amount','paid_at']
      .forEach(f => { if (req.body[f]!==undefined) updates[f]=req.body[f] });
    await p.update(updates);
    res.json(p);
  } catch (err) {
    res.status(400).json({ error: 'Gagal mengupdate payment', detail: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const p = await Payment.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: 'Payment tidak ditemukan' });
    await p.destroy();
    res.json({ message: 'Payment berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus payment' });
  }
};
