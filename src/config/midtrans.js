// src/config/midtrans.js
const midtransClient = require('midtrans-client');

const coreApi = new midtransClient.CoreApi({
  isProduction: false,                           
  serverKey: process.env.MIDTRANS_SERVER_KEY,    
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = coreApi;
