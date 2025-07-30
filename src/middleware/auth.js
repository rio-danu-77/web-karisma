// src/middleware/auth.js
const jwt = require('jsonwebtoken')
const { User } = require('../models')          // ← import model User
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_jangan_dibocorkan'

async function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan atau format salah' })
  }
  const token = header.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: 'Token tidak valid' })
    }

    // Ambil data lengkap user dari DB
    const user = await User.findByPk(decoded.id, {
      attributes: ['id','email','role','name','avatar_url']
    })
    if (!user) {
      return res.status(401).json({ success: false, message: 'User tidak ditemukan' })
    }

    // Attach seluruh info yang dibutuhkan
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avatar_url: user.avatar_url
    }
    next()
  } catch (err) {
    console.error('[auth] Token verification failed:', err.message)
    return res.status(401).json({ success: false, message: 'Token tidak valid atau expired' })
  }
}

module.exports = authenticate
