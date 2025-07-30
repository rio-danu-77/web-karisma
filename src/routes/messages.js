// src/routes/messages.js
const express = require('express')
const router  = express.Router()
const auth    = require('../middleware/auth')
const ctrl    = require('../controllers/messages')

router.get('/',           auth, ctrl.getAll)
router.get('/inbox',      auth, ctrl.getInbox)
router.get('/sent',       auth, ctrl.getSent)
router.get('/:id',        auth, ctrl.getById)
router.post('/',          auth, ctrl.create)
router.patch('/:id/read', auth, ctrl.markRead)
router.delete('/:id',     auth, ctrl.delete)

module.exports = router
