// src/middleware/authOptional.js
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_jangan_dibocorkan'

function authOptional(req, res, next) {
  const authHeader = req.headers.authorization
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim()
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded
      console.log('[authOptional] ✔ Token valid, user:', decoded)
    } catch (err) {
      console.warn('[authOptional] ⚠ Token invalid, lanjut tanpa user')
    }
  } else {
    console.log('[authOptional] ℹ No Bearer token, lanjut sebagai guest')
  }

  next()
}

module.exports = authOptional
