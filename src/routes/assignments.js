const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/assignments');

router.get('/', ctrl.getAllAssignments);
router.get('/:id', ctrl.getAssignmentById);
router.post('/', ctrl.createAssignment);
router.put('/:id', ctrl.updateAssignment);
router.delete('/:id', ctrl.deleteAssignment);

module.exports = router;
