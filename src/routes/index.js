const express = require('express')
const router = express.Router()

// ✅ Auth & User
router.use('/auth', require('./authRoutes'))
router.use('/users', require('./users'))

// ✅ Course & Enrollment flows
router.use('/courses', require('./courses'))
router.use('/enrollments', require('./enrollments'))
router.use('/payments', require('./payments')) 

// ✅ Content / Learning
router.use('/courses/:courseId/sessions', require('./sessions'))
router.use('/courses/:courseId/sessions/:sessionId/lessons', require('./lessons'))

// ✅ Quiz System
router.use('/quizzes', require('./quizzes'))
router.use('/quiz-options', require('./quizOptions'))
router.use('/lesson-progress', require('./lessonProgress'))
router.use('/quiz-answers', require('./quizAnswers'))
router.use('/user-answers', require('./userQuizAnswers'))

// router.use('/content', require('./content'))
// router.use('/assignments', require('./assignments'))
// router.use('/assignment-submissions', require('./assignmentSubmissions'))
router.use('/messages', require('./messages'))
router.use('/notifications', require('./notifications'))

// Default fallback untuk rute tak dikenal
router.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' })
})

module.exports = router
