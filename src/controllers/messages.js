// src/controllers/messages.js
const { Message, User } = require('../models')

// 🔐 (Admin) Semua pesan masuk
exports.getAll = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Hanya admin yang dapat melihat semua pesan' })
    }
    const messages = await Message.findAll({
      include: [
        { model: User, as: 'sender',   attributes: ['id','name','email','avatar_url'] },
        { model: User, as: 'receiver', attributes: ['id','name','email','avatar_url'] },
      ],
      order: [['sent_at','DESC']]
    })
    return res.json(messages)
  } catch (err) {
    console.error('[GET /messages] Error:', err)
    return res.status(500).json({ error: 'Terjadi kesalahan saat mengambil pesan' })
  }
}

// 📥 (User/Admin) Inbox: pesan yg diterima user
exports.getInbox = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { receiver_id: req.user.id },
      include: [ { model: User, as: 'sender', attributes: ['id','name','email','avatar_url'] } ],
      order: [['sent_at','DESC']]
    })
    return res.json(messages)
  } catch (err) {
    console.error('[GET /messages/inbox] Error:', err)
    return res.status(500).json({ error: 'Terjadi kesalahan saat mengambil inbox' })
  }
}

// 📤 (User/Admin) Sent: pesan yg dikirim user
exports.getSent = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { sender_id: req.user.id },
      include: [ { model: User, as: 'receiver', attributes: ['id','name','email','avatar_url'] } ],
      order: [['sent_at','DESC']]
    })
    return res.json(messages)
  } catch (err) {
    console.error('[GET /messages/sent] Error:', err)
    return res.status(500).json({ error: 'Terjadi kesalahan saat mengambil sent messages' })
  }
}

// 🔍 Detail + auto-mark read
exports.getById = async (req, res) => {
  try {
    const msg = await Message.findByPk(req.params.id, {
      include: [
        { model: User, as: 'sender',   attributes: ['id','name','email','avatar_url'] },
        { model: User, as: 'receiver', attributes: ['id','name','email','avatar_url'] },
      ]
    })
    if (!msg) return res.status(404).json({ error: 'Pesan tidak ditemukan' })

    const isReceiver = msg.receiver_id === req.user.id
    const isSender   = msg.sender_id   === req.user.id
    const isAdmin    = req.user.role   === 'admin'
    if (!isReceiver && !isSender && !isAdmin) {
      return res.status(403).json({ error: 'Tidak diizinkan mengakses pesan ini' })
    }

    if (isReceiver && msg.status === 'unread') {
      msg.status = 'read'
      await msg.save()
    }
    return res.json(msg)
  } catch (err) {
    console.error('[GET /messages/:id] Error:', err)
    return res.status(500).json({ error: 'Terjadi kesalahan saat mengambil pesan' })
  }
}

// ✉️ Kirim pesan ke admin
exports.create = async (req, res) => {
  try {
    const { body, subject=null, course_id=null } = req.body
    if (!body?.trim()) {
      return res.status(400).json({ error: 'Isi pesan tidak boleh kosong' })
    }
    const admin = await User.findOne({ where: { role:'admin' } })
    if (!admin) {
      return res.status(500).json({ error: 'Admin tidak ditemukan' })
    }
    const newMsg = await Message.create({
      sender_id:   req.user.id,
      receiver_id: admin.id,
      subject,
      body,
      course_id,
      status: 'unread',
      sent_at: new Date()
    })
    return res.status(201).json(newMsg)
  } catch (err) {
    console.error('[POST /messages] Error:', err)
    return res.status(500).json({ error: 'Gagal mengirim pesan' })
  }
}

exports.markRead = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id)
    if (!message) return res.status(404).json({ error: 'Pesan tidak ditemukan' })

    const isReceiver = message.receiver_id === req.user.id
    const isAdmin    = req.user.role === 'admin'
    if (!isReceiver && !isAdmin) {
      return res.status(403).json({ error: 'Tidak diizinkan menandai pesan ini' })
    }

    if (message.status !== 'read') {
      message.status = 'read'
      await message.save()
    }

    return res.status(200).json({ message: 'Pesan ditandai sebagai terbaca', data: message })
  } catch (err) {
    console.error('[PATCH /messages/:id/read] Error:', err)
    return res.status(500).json({ error: 'Terjadi kesalahan saat menandai pesan' })
  }
}

// 🗑️ Hapus pesan
exports.delete = async (req, res) => {
  try {
    const msg = await Message.findByPk(req.params.id)
    if (!msg) return res.status(404).json({ error:'Pesan tidak ditemukan' })

    const isReceiver = msg.receiver_id === req.user.id
    const isAdmin    = req.user.role   === 'admin'
    if (!isReceiver && !isAdmin) {
      return res.status(403).json({ error:'Tidak diizinkan menghapus pesan ini' })
    }
    await msg.destroy()
    return res.json({ message:'Pesan berhasil dihapus' })
  } catch (err) {
    console.error('[DELETE /messages/:id] Error:', err)
    return res.status(500).json({ error:'Terjadi kesalahan saat menghapus pesan' })
  }
}
