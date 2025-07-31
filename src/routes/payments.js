// src/routes/payments.js
const express = require('express');
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const ctrl = require('../controllers/payments');

const router = express.Router();

// 1) Webhook Midtrans (tanpa auth) — HARUS di paling atas
router.post(
  '/notification',
  express.json(),
  ctrl.handleNotification
);

// 2) Semua route berikut memerlukan user.login
router.use(auth);

// 3) Checkout (user)
router.post(
  '/checkout',
  body('course_id').isInt(),
  body('method').isString(),
  ctrl.checkout
);

// 4) CRUD & Konfirmasi untuk admin & user
router.get('/', ctrl.getAll);
router.get('/:id', param('id').isInt(), ctrl.getById);
router.patch('/:id/confirm', param('id').isInt(), ctrl.confirmPayment);
router.patch('/:id/reject',  param('id').isInt(), ctrl.rejectPayment);
router.post('/', body('course_id').isInt(), body('method').isString(), ctrl.create);
router.put('/:id', param('id').isInt(), body('status').isString(), ctrl.update);
router.delete('/:id', param('id').isInt(), ctrl.delete);

module.exports = router;
