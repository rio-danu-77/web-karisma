const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const UserQuizAnswer = sequelize.define('UserQuizAnswer', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  quiz_id: {
    type: DataTypes.BIGINT, 
    allowNull: false
  },
  quiz_option_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'user_quiz_answers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = UserQuizAnswer
