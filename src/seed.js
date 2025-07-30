// src/seed.js
require('dotenv').config();
const { sequelize, User } = require('./models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected.');
    await sequelize.sync(); // or force:true
    await User.bulkCreate([
      { name: 'Demo User', email: 'demo@example.com', password: 'demo123', role: 'user', domicile: 'Jakarta' },
      { name: 'Admin',     email: 'admin@example.com', password: 'admin123', role: 'admin', domicile: 'Bandung' },
    ]);
    console.log('Seeding done.');
    process.exit();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
