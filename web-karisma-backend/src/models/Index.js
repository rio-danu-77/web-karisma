// src/models/index.js

const sequelize = require('../config/db');

// Import semua model
const User                   = require('./User');
const Category               = require('./Category');
const Course                 = require('./Course');
const Session                = require('./Session');
const Lesson                 = require('./Lesson');
const Quiz                   = require('./Quiz');
const QuizOption             = require('./QuizOption');
const Assignment             = require('./Assignment');
const AssignmentSubmission   = require('./AssignmentSubmission');
const Enrollment             = require('./Enrollment');
const Payment                = require('./Payment');
const Notification           = require('./Notification');
const Message                = require('./Message');

// Definisikan relasi sesuai ERD

// Category ↔ Course
Category.hasMany(Course, { foreignKey: 'category_id' });
Course.belongsTo(Category, { foreignKey: 'category_id' });

// Course ↔ Session (Module)
Course.hasMany(Session, { foreignKey: 'course_id' });
Session.belongsTo(Course, { foreignKey: 'course_id' });

// Session ↔ Lesson
Session.hasMany(Lesson, { foreignKey: 'session_id' });
Lesson.belongsTo(Session, { foreignKey: 'session_id' });

// Lesson ↔ Quiz
Lesson.hasMany(Quiz, { foreignKey: 'lesson_id' });
Quiz.belongsTo(Lesson, { foreignKey: 'lesson_id' });

// Quiz ↔ QuizOption
Quiz.hasMany(QuizOption, { foreignKey: 'quiz_id' });
QuizOption.belongsTo(Quiz, { foreignKey: 'quiz_id' });

// Course ↔ Assignment
Course.hasMany(Assignment, { foreignKey: 'course_id' });
Assignment.belongsTo(Course, { foreignKey: 'course_id' });

// Assignment ↔ AssignmentSubmission
Assignment.hasMany(AssignmentSubmission, { foreignKey: 'assignment_id' });
AssignmentSubmission.belongsTo(Assignment, { foreignKey: 'assignment_id' });
// Submission ↔ User
User.hasMany(AssignmentSubmission, { foreignKey: 'user_id' });
AssignmentSubmission.belongsTo(User, { foreignKey: 'user_id' });

// User ↔ Enrollment ↔ Course
User.hasMany(Enrollment, { foreignKey: 'user_id' });
Enrollment.belongsTo(User, { foreignKey: 'user_id' });
Course.hasMany(Enrollment, { foreignKey: 'course_id' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id' });

// User ↔ Payment ↔ Course
User.hasMany(Payment, { foreignKey: 'user_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });
Course.hasMany(Payment, { foreignKey: 'course_id' });
Payment.belongsTo(Course, { foreignKey: 'course_id' });

// User ↔ Notification
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// User ↔ Message (Inbox)
User.hasMany(Message, { foreignKey: 'sender_id',   as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'ReceivedMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id',   as: 'Sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'Receiver' });
// Message ↔ Course (opsional)
Course.hasMany(Message, { foreignKey: 'course_id' });
Message.belongsTo(Course, { foreignKey: 'course_id' });

// Export sequelize instance dan semua model
module.exports = {
  sequelize,
  User,
  Category,
  Course,
  Session,
  Lesson,
  Quiz,
  QuizOption,
  Assignment,
  AssignmentSubmission,
  Enrollment,
  Certificate,
  Payment,
  Notification,
  Message
};
