// src/routes/payments.js
const express = require('express');
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const ctrl = require('../controllers/payments');

const router = express.Router();

// 💸 Admin & user routes
router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, param('id').isInt(), ctrl.getById);
router.patch('/:id/confirm', auth, param('id').isInt(), ctrl.confirmPayment);
router.patch('/:id/reject', auth, param('id').isInt(), ctrl.rejectPayment);
router.post('/', auth, body('course_id').isInt(), body('method').isString(), ctrl.create);
router.put('/:id', auth, param('id').isInt(), body('status').isString(), ctrl.update);
router.delete('/:id', auth, param('id').isInt(), ctrl.delete);

// 🔥 Midtrans checkout (user)
router.post('/checkout', auth, body('course_id').isInt(), body('method').isString(), ctrl.checkout);

// 📡 Midtrans Webhook – TANPA auth, dan harus paling atas biar gak ketabrak
router.post('/notification', express.json(), ctrl.handleNotification);

module.exports = router;
