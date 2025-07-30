const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  session_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  video_url: {
    type: DataTypes.STRING(512),
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  order_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'lessons',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
})

Lesson.associate = models => {
  Lesson.belongsTo(models.Session, { foreignKey: 'session_id' })
  Lesson.hasMany(models.Quiz, { foreignKey: 'lesson_id', as: 'quizzes' })
}

module.exports = Lesson
