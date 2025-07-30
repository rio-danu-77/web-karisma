// src/routes/users.js
const express = require('express')
const multer = require('multer')
const { body, validationResult } = require('express-validator')
const authMiddleware = require('../middleware/auth')
const userController = require('../controllers/user')
const { User, Enrollment, Course } = require('../models')

const router = express.Router()

// Setup multer untuk avatar upload
const upload = multer({
  dest: 'uploads/avatars/',
  limits: { fileSize: 2 * 1024 * 1024 }, // max 2MB
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Hanya file gambar yang diizinkan'), false)
    }
    cb(null, true)
  }
})

/**
 * GET /users/profile
 * Ambil profil user yang sedang login (include enrollments + course)
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Enrollment,
        as: 'enrollments',
        attributes: ['id', 'status', 'enrolled_at', 'completed_at', 'progress'],
        include: [{
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'thumbnail_url']
        }]
      }]
    })
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' })
    res.json({ user })
  } catch (err) {
    console.error('Get profile error:', err)
    res.status(500).json({ message: 'Gagal mengambil profile' })
  }
})

/**
 * PATCH /users/profile
 * Update profil user yang sedang login
 */
router.patch(
  '/profile',
  authMiddleware,
  upload.single('avatar'),
  [
    body('name').optional().notEmpty().withMessage('Nama tidak boleh kosong'),
    body('email').optional().isEmail().withMessage('Email tidak valid'),
    body('address').optional().isString().withMessage('Alamat harus teks'),
    body('domicile').optional().isString().withMessage('Domisili harus teks'),
    body('birth_date').optional().isISO8601().withMessage('Tanggal lahir tidak valid')
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const user = await User.findByPk(req.user.id)
      if (!user) return res.status(404).json({ message: 'User tidak ditemukan' })

      const updates = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        domicile: req.body.domicile,
        birth_date: req.body.birth_date
      }

      if (req.file) {
        updates.avatar_url = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`
      }

      await user.update(updates)
      const updated = user.toJSON()
      delete updated.password

      res.json({ message: 'Profil diperbarui', user: updated })
    } catch (err) {
      console.error('Update profile error:', err)
      res.status(500).json({ message: 'Terjadi kesalahan saat update profil.' })
    }
  }
)

/**
 * GET /users/count
 * Hitung jumlah total user dengan role 'user' (admin)
 */
router.get('/count', authMiddleware, async (req, res) => {
  try {
    const total = await User.count({ where: { role: 'user' } })
    res.json({ total })
  } catch (err) {
    console.error('Error menghitung total user:', err)
    res.status(500).json({ message: 'Gagal menghitung user' })
  }
})

/**
 * GET /users
 * Ambil semua data user dengan role 'user' (admin)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'user' },
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password'] }
    })
    res.json(users)
  } catch (err) {
    console.error('Error fetching users:', err)
    res.status(500).json({ message: 'Gagal mengambil data user' })
  }
})

/**
 * GET /users/activity
 * Ambil aktivitas terakhir user (riwayat daftar kursus)
 */
router.get('/activity', authMiddleware, async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title']
        }
      ],
      order: [['enrolled_at', 'DESC']],
      limit: 5
    })

    const activities = enrollments.map(enrollment => ({
      date: enrollment.enrolled_at
        ? new Date(enrollment.enrolled_at).toLocaleDateString('id-ID')
        : 'Tanggal tidak diketahui',
      description: `Mendaftar kursus: "${enrollment.course?.title || 'Tanpa Judul'}"`,
      status: enrollment.status
    }))

    res.json({ activities })
  } catch (err) {
    console.error('❌ Error fetching activity (enrollment):', err)
    res.status(500).json({ message: 'Gagal mengambil aktivitas', detail: err.message })
  }
})

/**
 * GET /users/transactions/stats
 * Statistik keuangan user
 */
router.get('/transactions/stats', authMiddleware, userController.getFinanceStats)

/**
 * ✅ Tambahan baru:
 * GET /users/me/courses
 * Ambil semua kursus yang sudah dibeli oleh user (melalui tabel payments)
 */
router.get('/me/courses', authMiddleware, userController.getUserCourses)

/**
 * GET /users/:id
 * Detail user (untuk admin)
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Enrollment,
        as: 'enrollments',
        attributes: ['status', 'enrolled_at', 'completed_at', 'progress'],
        include: [{
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'thumbnail_url']
        }]
      }]
    })

    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' })
    res.json(user)
  } catch (err) {
    console.error('Error fetching user detail:', err)
    res.status(500).json({ message: 'Gagal mengambil detail user', detail: err.message })
  }
})

module.exports = router
