const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/quizzes');

router.get('/', ctrl.getAllQuizzes);
router.get('/:id', ctrl.getQuizById);
router.post('/', ctrl.createQuiz);
router.put('/:id', ctrl.updateQuiz);
router.delete('/:id', ctrl.deleteQuiz);

module.exports = router;
