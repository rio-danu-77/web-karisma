// src/controllers/payments.js
const {
  Payment, User, Course,
  Enrollment, Notification,
  sequelize
} = require('../models');
const snap = require('../services/midtrans');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

// Helper: handle validation errors
function handleValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return true;
  }
  return false;
}

module.exports = {
  // GET /api/payments (admin)
  getAll: async (req, res) => {
    if (req.user.role !== 'admin')
      return res.status(403).json({ success: false, error: 'Hanya admin' });
    try {
      const payments = await Payment.findAll({
        include: [
          { model: User,   as: 'user',   attributes: ['id','name','email','avatar_url'] },
          { model: Course, as: 'course', attributes: ['id','title','price'] }
        ],
        order: [['created_at','DESC']]
      });
      res.json({ success: true, data: payments });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Gagal fetch payments' });
    }
  },

  // GET /api/payments/:id (admin)
  getById: async (req, res) => {
    if (handleValidationErrors(req, res)) return;
    if (req.user.role !== 'admin')
      return res.status(403).json({ success: false, error: 'Hanya admin' });
    try {
      const payment = await Payment.findByPk(req.params.id, {
        include: [
          { model: User,   as: 'user',   attributes: ['id','name','email','avatar_url'] },
          { model: Course, as: 'course', attributes: ['id','title','price'] }
        ]
      });
      if (!payment)
        return res.status(404).json({ success: false, error: 'Tidak ditemukan' });
      res.json({ success: true, data: payment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Gagal fetch detail' });
    }
  },

  // POST /api/payments/checkout (user)
  checkout: async (req, res) => {
    if (handleValidationErrors(req, res)) return;
    const { course_id, method } = req.body;
    const validMethods = ['manual','bank_transfer','ewallet','credit_card','midtrans'];
    if (!validMethods.includes(method))
      return res.status(400).json({ success: false, error: 'Metode tidak valid' });

    const t = await sequelize.transaction();
    try {
      const course = await Course.findByPk(course_id, { transaction: t });
      if (!course) throw new Error('Kursus tidak ditemukan');

      const already = await Payment.findOne({
        where: { user_id: req.user.id, course_id },
        transaction: t
      });
      if (already) throw new Error('Sudah membeli');

      const isManual = method === 'manual';
      const status   = isManual ? 'paid' : 'pending';
      const paid_at  = isManual ? new Date() : null;
      const trxRef   = `${method.toUpperCase()}-${Date.now()}-${req.user.id}`;

      const payment = await Payment.create({
        user_id: req.user.id,
        course_id,
        transaction_reference: trxRef,
        method,
        amount: course.price,
        status,
        paid_at
      }, { transaction: t });

      let enrollment = null, snapToken = null;

      if (isManual) {
        [enrollment] = await Enrollment.findOrCreate({
          where: { user_id: req.user.id, course_id },
          defaults: { status: 'in_progress', progress: 0, enrolled_at: new Date() },
          transaction: t
        });
        await Notification.create({
          user_id: req.user.id,
          type: 'success',
          content: `Pembayaran kursus "${course.title}" berhasil!`,
          status: 'unread',
          created_at: new Date()
        }, { transaction: t });
      } else {
        const snapRes = await snap.createTransaction({
          transaction_details: { order_id: trxRef, gross_amount: course.price },
          credit_card: { secure: true },
          customer_details: { first_name: req.user.name, email: req.user.email }
        });
        snapToken = snapRes.token;
      }

      await t.commit();
      res.status(201).json({
        success: true,
        message: isManual
          ? 'Pembayaran manual berhasil'
          : 'Selesaikan pembayaran via Midtrans',
        data: { payment, enrollment, snapToken }
      });
    } catch (err) {
      await t.rollback();
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // POST /api/payments/notification (Midtrans webhook)
handleNotification: async (req, res) => {
  try {
    const notif = req.body;

    // ✅ Verifikasi signature key (opsional tapi penting)
    const crypto = require('crypto');
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const hash = crypto.createHash('sha512')
      .update(notif.order_id + notif.status_code + notif.gross_amount + serverKey)
      .digest('hex');

    if (notif.signature_key !== hash) {
      return res.status(403).json({ message: 'Invalid signature' });
    }

    // ✅ Ambil data pembayaran dari DB berdasarkan order_id
    const payment = await Payment.findOne({ where: { transaction_reference: notif.order_id } });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // ✅ Update status sesuai response dari Midtrans
    let newStatus = notif.transaction_status;
    if (newStatus === 'settlement') {
      payment.status = 'success';
    } else if (newStatus === 'pending') {
      payment.status = 'pending';
    } else if (newStatus === 'deny' || newStatus === 'expire' || newStatus === 'cancel') {
      payment.status = 'failed';
    }

    await payment.save();

    res.status(200).json({ message: 'Notification handled successfully' });
  } catch (error) {
    console.error('❌ Error handling notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},

  // PATCH /api/payments/:id/confirm (admin)
  confirmPayment: async (req, res) => {
    if (handleValidationErrors(req, res)) return;
    if (req.user.role !== 'admin')
      return res.status(403).json({ success: false, error: 'Hanya admin' });

    const t = await sequelize.transaction();
    try {
      const payment = await Payment.findByPk(req.params.id, {
        include: [{ model: Course, as: 'course' }],
        transaction: t
      });
      if (!payment) throw new Error('Tidak ditemukan');
      if (payment.status === 'paid') throw new Error('Sudah konfirmasi');

      payment.status = 'paid';
      payment.paid_at = new Date();
      await payment.save({ transaction: t });

      await Enrollment.findOrCreate({
        where: { user_id: payment.user_id, course_id: payment.course_id },
        defaults: { status: 'in_progress', progress: 0, enrolled_at: new Date() },
        transaction: t
      });
      await Notification.create({
        user_id: payment.user_id,
        type: 'success',
        content: `Pembayaran "${payment.course.title}" dikonfirmasi!`,
        status: 'unread',
        created_at: new Date()
      }, { transaction: t });

      await t.commit();
      res.json({ success: true, message: 'Dikonfirmasi', data: payment });
    } catch (err) {
      await t.rollback();
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // PATCH /api/payments/:id/reject (admin)
  rejectPayment: async (req, res) => {
    if (req.user.role !== 'admin')
      return res.status(403).json({ success: false, error: 'Hanya admin' });

    const t = await sequelize.transaction();
    try {
      const payment = await Payment.findByPk(req.params.id, { transaction: t });
      if (!payment) throw new Error('Tidak ditemukan');
      if (payment.status !== 'pending')
        throw new Error('Hanya pending yang bisa ditolak');

      payment.status = 'failed';
      await payment.save({ transaction: t });

      await Enrollment.destroy({
        where: { user_id: payment.user_id, course_id: payment.course_id },
        transaction: t
      });
      await Notification.create({
        user_id: payment.user_id,
        type: 'error',
        content: `Pembayaran ID ${payment.id} telah ditolak.`,
        status: 'unread',
        created_at: new Date()
      }, { transaction: t });

      await t.commit();
      res.json({ success: true, message: 'Ditolak' });
    } catch (err) {
      await t.rollback();
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // POST /api/payments (admin manual entry)
  create: async (req, res) => {
    if (handleValidationErrors(req, res)) return;
    if (req.user.role !== 'admin')
      return res.status(403).json({ success: false, error: 'Hanya admin dapat membuat payment manual' });

    try {
      const { user_id, course_id, transaction_reference, method, status, amount, paid_at } = req.body;
      const valid = ['manual','bank_transfer','ewallet','credit_card','midtrans'];
      if (!valid.includes(method)) throw new Error('Metode tidak valid');

      const payment = await Payment.create({ user_id, course_id, transaction_reference, method, status, amount, paid_at });
      return res.status(201).json({ success: true, message: 'Pembayaran manual berhasil', data: payment });
    } catch (err) {
      console.error('❌ create payment error:', err);
      return res.status(400).json({ success: false, error: err.message });
    }
  },

  // PUT /api/payments/:id (admin update)
  update: async (req, res) => {
    if (handleValidationErrors(req, res)) return;
    if (req.user.role !== 'admin')
      return res.status(403).json({ success: false, error: 'Hanya admin dapat mengubah pembayaran' });

    try {
      const payment = await Payment.findByPk(req.params.id);
      if (!payment) return res.status(404).json({ success: false, error: 'Pembayaran tidak ditemukan' });

      const { status, paid_at } = req.body;
      await payment.update({ status, paid_at });

      if (status === 'paid') {
        await Enrollment.findOrCreate({
          where: { user_id: payment.user_id, course_id: payment.course_id },
          defaults: { status: 'in_progress', progress: 0, enrolled_at: new Date() }
        });
        await Notification.create({
          user_id: payment.user_id,
          type: 'success',
          content: `Pembayaran kursus ID ${payment.course_id} sudah dibayar.`,
          status: 'unread',
          created_at: new Date()
        });
      }

      return res.json({ success: true, message: 'Pembayaran diperbarui', data: payment });
    } catch (err) {
      console.error('❌ update payment error:', err);
      return res.status(400).json({ success: false, error: err.message });
    }
  },

  // DELETE /api/payments/:id (admin delete)
  delete: async (req, res) => {
    if (handleValidationErrors(req, res)) return;
    if (req.user.role !== 'admin')
      return res.status(403).json({ success: false, error: 'Hanya admin dapat menghapus pembayaran' });

    try {
      const payment = await Payment.findByPk(req.params.id);
      if (!payment) return res.status(404).json({ success: false, error: 'Pembayaran tidak ditemukan' });

      const { user_id, course_id } = payment;
      await payment.destroy();
      await Enrollment.destroy({ where: { user_id, course_id } });

      return res.json({ success: true, message: 'Pembayaran & enrollment berhasil dihapus' });
    } catch (err) {
      console.error('❌ delete payment error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};
