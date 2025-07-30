// src/models/Index.js
const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// Import semua model
const User                 = require('./User');
const Category             = require('./Category');
const Course               = require('./Course');
const Session              = require('./Session');
const Lesson               = require('./Lesson');
const LessonProgress       = require('./LessonProgress');
const Quiz                 = require('./Quiz');
const QuizOption           = require('./QuizOption');
const UserQuizAnswer       = require('./UserQuizAnswer');
const Assignment           = require('./Assignment');
const AssignmentSubmission = require('./AssignmentSubmission');
const Enrollment           = require('./Enrollment');
const Payment              = require('./Payment');
const Notification         = require('./Notification');
const Message              = require('./Message');

// Category <-> Course
Category.hasMany(Course, { foreignKey: 'category_id', as: 'courses' });
Course.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Course <-> Session
Course.hasMany(Session, { foreignKey: 'course_id', as: 'sessions' });
Session.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Session <-> Lesson
Session.hasMany(Lesson, { foreignKey: 'session_id', as: 'lessons' });
Lesson.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });

// Lesson <-> Quiz
Lesson.hasMany(Quiz, { foreignKey: 'lesson_id', as: 'quizzes' });
Quiz.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

// Quiz <-> QuizOption
Quiz.hasMany(QuizOption, { foreignKey: 'quiz_id', as: 'options' });
QuizOption.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

// User <-> UserQuizAnswer
User.hasMany(UserQuizAnswer, { foreignKey: 'user_id', as: 'quizAnswers' });
UserQuizAnswer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Quiz <-> UserQuizAnswer
Quiz.hasMany(UserQuizAnswer, { foreignKey: 'quiz_id', as: 'userAnswers' });
UserQuizAnswer.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

// QuizOption <-> UserQuizAnswer
QuizOption.hasMany(UserQuizAnswer, { foreignKey: 'quiz_option_id', as: 'answers' });
UserQuizAnswer.belongsTo(QuizOption, { foreignKey: 'quiz_option_id', as: 'option' });

// Course <-> Assignment
Course.hasMany(Assignment, { foreignKey: 'course_id', as: 'assignments' });
Assignment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Assignment <-> AssignmentSubmission
Assignment.hasMany(AssignmentSubmission, { foreignKey: 'assignment_id', as: 'submissions' });
AssignmentSubmission.belongsTo(Assignment, { foreignKey: 'assignment_id', as: 'assignment' });

// User <-> AssignmentSubmission
User.hasMany(AssignmentSubmission, { foreignKey: 'user_id', as: 'submissions' });
AssignmentSubmission.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Enrollment
User.hasMany(Enrollment, { foreignKey: 'user_id', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Course.hasMany(Enrollment, { foreignKey: 'course_id', as: 'enrollments' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Payment
User.hasMany(Payment, { foreignKey: 'user_id', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Course.hasMany(Payment, { foreignKey: 'course_id', as: 'payments' });
Payment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Notification
User.hasMany(Notification, {
  foreignKey: 'user_id',
  as: 'notifications',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Notification.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Message
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'receivedMessages' });

Message.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
Course.hasMany(Message, { foreignKey: 'course_id', as: 'messages' });

// Many-to-Many User <-> Lesson (via LessonProgress)
User.belongsToMany(Lesson, {
  through: LessonProgress,
  foreignKey: 'user_id',
  otherKey: 'lesson_id',
  as: 'watchedLessons'
});

Lesson.belongsToMany(User, {
  through: LessonProgress,
  foreignKey: 'lesson_id',
  otherKey: 'user_id',
  as: 'lessonViewers'
});

// Direct relation to access LessonProgress itself
LessonProgress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
LessonProgress.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

User.hasMany(LessonProgress, { foreignKey: 'user_id', as: 'lessonProgresses' });
Lesson.hasMany(LessonProgress, { foreignKey: 'lesson_id', as: 'progresses' });

module.exports = {
  sequelize,
  User,
  Category,
  Course,
  Session,
  Lesson,
  LessonProgress,
  Quiz,
  QuizOption,
  UserQuizAnswer,
  Assignment,
  AssignmentSubmission,
  Enrollment,
  Payment,
  Notification,
  Message
};
