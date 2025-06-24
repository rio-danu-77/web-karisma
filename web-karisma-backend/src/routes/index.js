const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/courses', require('./courses'));
router.use('/enrollments', require('./enrollments'));
router.use('/payments', require('./payments'));
router.use('/messages', require('./messages'));
router.use('/notifications', require('./notifications'));
router.use('/sessions', require('./sessions'));
router.use('/quizzes', require('./quizzes'));
router.use('/quizOptions', require('./quizOptions'));
router.use('/assignments', require('./assignments'));
router.use('/assignmentSubmissions', require('./assignmentSubmissions'));
router.use('/certificates', require('./certificates'));

module.exports = router;
