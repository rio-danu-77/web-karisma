// src/controllers/notifications.js
const { Notification, User } = require('../models');

// GET /api/notifications/inbox
exports.getInbox = async (req, res) => {
  try {
    const notifs = await Notification.findAll({
      where: { user_id: req.user.id, status: 'unread' },
      include: [{ model: User, as: 'user', attributes: ['id','name','avatar_url'] }],
      order: [['created_at','DESC']]
    });
    return res.json({ success: true, data: notifs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Gagal mengambil notifikasi' });
  }
};

// PATCH /api/notifications/:id/read
exports.markRead = async (req, res) => {
  try {
    const notif = await Notification.findOne({ where: { id: req.params.id, user_id: req.user.id }});
    if (!notif) return res.status(404).json({ success: false, error: 'Notifikasi tidak ditemukan' });
    if (notif.status === 'unread') {
      notif.status = 'read';
      await notif.save();
    }
    return res.json({ success: true, message: 'Notifikasi ditandai terbaca' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Gagal menandai notifikasi' });
  }
};

// DELETE /api/notifications/:id
exports.delete = async (req, res) => {
  try {
    const notif = await Notification.findOne({ where: { id: req.params.id, user_id: req.user.id }});
    if (!notif) return res.status(404).json({ success: false, error: 'Notifikasi tidak ditemukan' });
    await notif.destroy();
    return res.json({ success: true, message: 'Notifikasi dihapus' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Gagal menghapus notifikasi' });
  }
};
