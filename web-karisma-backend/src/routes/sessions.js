const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/sessions');

router.get('/', ctrl.getAllSessions);
router.get('/:id', ctrl.getSessionById);
router.post('/', ctrl.createSession);
router.put('/:id', ctrl.updateSession);
router.delete('/:id', ctrl.deleteSession);

module.exports = router;
