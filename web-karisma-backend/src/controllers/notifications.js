const { Notification } = require('../models');

exports.getAllNotifications = async (req, res) => {
  try {
    const data = await Notification.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data notifications' });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification tidak ditemukan' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil notification' });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { user_id, type, content, status } = req.body;
    const created = await Notification.create({ user_id, type, content, status });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: 'Gagal membuat notification', detail: err.message });
  }
};

exports.updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification tidak ditemukan' });

    const { user_id, type, content, status } = req.body;
    await notification.update({ user_id, type, content, status });
    res.json(notification);
  } catch (err) {
    res.status(400).json({ error: 'Gagal mengupdate notification', detail: err.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification tidak ditemukan' });

    await notification.destroy();
    res.json({ message: 'Notification berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus notification' });
  }
};
