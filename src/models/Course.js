// src/models/Course.js
const { DataTypes } = require('sequelize')
const sequelize      = require('../config/db')

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active','inactive'),
    defaultValue: 'inactive'
  },
  thumbnail_url: {
    type: DataTypes.STRING(512),
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName:  'courses',
  timestamps: true,
  createdAt:  'created_at',
  updatedAt:  'updated_at'
})

// **Relasi ke Category**
Course.associate = models => {
  Course.belongsTo(models.Category, {
    foreignKey: 'category_id',
    as: 'Category'
  })
}

module.exports = Course
