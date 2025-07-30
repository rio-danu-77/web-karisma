// src/services/midtrans.js
const midtransClient = require('midtrans-client');
require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

const snap = new midtransClient.Snap({
  isProduction: isProd,
  serverKey:    process.env.MIDTRANS_SERVER_KEY,
  clientKey:    process.env.MIDTRANS_CLIENT_KEY
});

module.exports = snap;
