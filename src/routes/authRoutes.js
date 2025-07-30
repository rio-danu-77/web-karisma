const express = require('express')
const { body } = require('express-validator')
const { login, register } = require('../controllers/authController')

const router = express.Router()

// REGISTER
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Nama wajib diisi'),
    body('email').isEmail().withMessage('Email tidak valid'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  ],
  register
)

// LOGIN
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email tidak valid'),
    body('password').notEmpty().withMessage('Password wajib diisi'),
  ],
  login
)

module.exports = router
