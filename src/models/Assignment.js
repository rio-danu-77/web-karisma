// src/models/Assignment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Assignment = sequelize.define('Assignment', {
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
    type: DataTypes.STRING(512),
    allowNull: false
  }
}, {
  tableName: 'assignments',
  timestamps: false
});

module.exports = Assignment;
