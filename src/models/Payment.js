// src/models/Payment.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Payment = sequelize.define('Payment', {
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
  transaction_reference: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  method: {
    type: DataTypes.ENUM('manual', 'midtrans'),
    allowNull: false,
    defaultValue: 'manual'
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'pending'
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  payment_url: {
    type: DataTypes.STRING(255),
    allowNull: true 
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'payments',
  timestamps: false
})

module.exports = Payment
