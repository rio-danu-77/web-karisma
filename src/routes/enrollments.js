// src/routes/enrollments.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const ctrl    = require('../controllers/enrollments');

// Admin-only
router.get('/',                        auth, ctrl.getAll);
router.get('/admin/course/:courseId', auth, ctrl.getByCourseAdmin);

// User-specific
router.post('/enroll',    auth, ctrl.enrollCourse);
router.get('/me',         auth, ctrl.getMyEnrollments);
router.get('/user/:userId', auth, ctrl.getByUser);

// By courseId
router.get('/course/:courseId',          auth, ctrl.getByCourse);
router.get('/course/:courseId/progress', auth, ctrl.getMyProgressByCourse);

// Progress-map per session
router.get('/:id/progress-map', auth, ctrl.getProgressMap);

// Mark a session completed
router.post('/:id/progress',   auth, ctrl.markSessionProgress);

// Progress & status by enrollment ID
router.get('/:id/progress',     auth, ctrl.getProgressById);

// Detail by enrollment ID
router.get('/:id', auth, ctrl.getById);

// Update progress (PATCH) & full update (PUT)
router.patch('/:id/progress', auth, ctrl.updateEnrollment);
router.put('/:id',            auth, ctrl.updateEnrollment);

// Delete
router.delete('/:id', auth, ctrl.deleteEnrollment);

module.exports = router;
