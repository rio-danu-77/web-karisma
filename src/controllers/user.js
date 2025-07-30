// src/controllers/user.js
const { Payment, Course, User } = require('../models')
const { Op } = require('sequelize')

exports.getFinanceStats = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: {
        status: 'paid',
        paid_at: { [Op.not]: null }
      },
      attributes: ['amount', 'paid_at'],
      order: [['paid_at', 'ASC']],
      limit: 1000
    })

    const monthlyStats = {}

    payments.forEach(p => {
      const paidAt = new Date(p.paid_at)
      if (isNaN(paidAt)) return

      const monthKey = paidAt.toLocaleString('id-ID', { month: 'short', year: 'numeric' })

      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { income: 0, expense: 0 }
      }

      monthlyStats[monthKey].income += parseFloat(p.amount || 0)
    })

    const result = Object.entries(monthlyStats).map(([month, data]) => ({
      month,
      income: data.income,
      expense: Math.floor(data.income * 0.2)
    }))

    res.json(result)
  } catch (err) {
    console.error('❌ Finance stats error:', err)
    res.status(500).json({ message: 'Gagal mengambil data statistik finansial' })
  }
}

exports.getUserCourses = async (req, res) => {
  try {
    const userId = req.user.id

    const payments = await Payment.findAll({
      where: {
        user_id: userId,
        status: 'paid'
      },
      include: [
        {
          model: Course,
          as: 'course', // pastikan alias di relasi model sesuai
          attributes: ['id', 'title', 'description', 'thumbnail_url', 'category', 'price', 'status']
        }
      ]
    })

    const courses = payments
      .map(p => p.course)
      .filter(course => course) // pastikan datanya tidak null

    res.json(courses)
  } catch (err) {
    console.error('❌ User course error:', err)
    res.status(500).json({ message: 'Gagal mengambil kursus yang telah dibeli user' })
  }
}
