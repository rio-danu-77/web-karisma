// src/models/QuizOption.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const QuizOption = sequelize.define('QuizOption', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  quiz_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  option_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_correct: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'quiz_options',
  timestamps: false
});

module.exports = QuizOption;
