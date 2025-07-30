// src/models/Session.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  course_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  order_index: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

Session.associate = models => {
  // setiap Session → banyak Lesson
  Session.hasMany(models.Lesson, {
    foreignKey: 'session_id',
    as: 'lessons'
  })
  // setiap Session → dipunyai Course
  Session.belongsTo(models.Course, {
    foreignKey: 'course_id',
    as: 'course'
  })
}

module.exports = Session
