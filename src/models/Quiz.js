// src/models/Quiz.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const Lesson = require('./Lesson')

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  lesson_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'quizzes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = Quiz
