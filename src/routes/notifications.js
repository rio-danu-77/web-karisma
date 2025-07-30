// src/routes/notifications.js
const express = require('express');
const auth    = require('../middleware/auth');
const ctrl    = require('../controllers/notifications');
const router  = express.Router();

router.get('/inbox',      auth, ctrl.getInbox);
router.patch('/:id/read', auth, ctrl.markRead);
router.delete('/:id',     auth, ctrl.delete);

module.exports = router;
