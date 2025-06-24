const express = require('express');
const router = express.Router();
const quizOptionController = require('../controllers/quizOptions');

router.get('/', quizOptionController.getAllQuizOptions);
router.get('/:id', quizOptionController.getQuizOptionById);
router.post('/', quizOptionController.createQuizOption);
router.put('/:id', quizOptionController.updateQuizOption);
router.delete('/:id', quizOptionController.deleteQuizOption);

module.exports = router;
