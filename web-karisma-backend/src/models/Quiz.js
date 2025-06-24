// src/models/Quiz.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  course_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'quizzes',
  timestamps: false
});

module.exports = Quiz;
