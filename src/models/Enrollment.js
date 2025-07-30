// src/models/Enrollment.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  course_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed', 'dropped'),
    allowNull: false,
    defaultValue: 'in_progress'
  },
  enrolled_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  progress: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  completed_lessons: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  order_id: {
  type: DataTypes.STRING,
  allowNull: true,
  unique: true
 }
}, {
  tableName: 'enrollments',
  underscored: true,
  timestamps: false
})

module.exports = Enrollment
