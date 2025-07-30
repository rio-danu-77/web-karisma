// src/controllers/authController.js
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const User = require('../models/User')

const JWT_SECRET  = process.env.JWT_SECRET  || 'rahasia_jangan_dibocorkan'
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h'

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  )
}

const register = async (req, res) => {
  console.log('🟢 Register payload:', req.body)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const { name, email, password, birth_date, domicile, avatar_url, address } = req.body

  try {
    const existing = await User.findOne({ where: { email } })
    if (existing) {
      return res.status(409).json({ message: 'Email sudah terdaftar' })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hash,
      birth_date,
      domicile,
      avatar_url,
      address,
      role: 'user'
    })

    const token = signToken(user)
    console.log('✅ Register success for:', email)

    // Kirim seluruh data user (kecuali password)
    const userData = user.toJSON()
    delete userData.password

    return res.status(201).json({ token, user: userData })
  } catch (err) {
    console.error('🔥 Register Error:', err.stack || err)
    return res.status(500).json({ message: 'Terjadi kesalahan saat mendaftar.' })
  }
}

const login = async (req, res) => {
  console.log('🟢 Login payload:', req.body)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  try {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ message: 'Email atau password salah' })
    }

    const token = signToken(user)
    console.log('✅ Login success for:', email)

    // Kirim seluruh data user (kecuali password)
    const userData = user.toJSON()
    delete userData.password

    return res.json({ token, user: userData })
  } catch (err) {
    console.error('🔥 Login Error:', err.stack || err)
    return res.status(500).json({ message: 'Terjadi kesalahan saat login.' })
  }
}

module.exports = { register, login }
