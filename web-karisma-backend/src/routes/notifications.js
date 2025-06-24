const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/notifications');

router.get('/', ctrl.getAllNotifications);
router.get('/:id', ctrl.getNotificationById);
router.post('/', ctrl.createNotification);
router.put('/:id', ctrl.updateNotification);
router.delete('/:id', ctrl.deleteNotification);

module.exports = router;
