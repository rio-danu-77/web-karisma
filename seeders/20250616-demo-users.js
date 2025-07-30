'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      { name: 'Demo User', email: 'demo@example.com', password: 'demo123', role: 'user', domicile: 'Jakarta', created_at: new Date(), updated_at: new Date() },
      { name: 'Admin',     email: 'admin@example.com', password: 'admin123', role: 'admin', domicile: 'Bandung',  created_at: new Date(), updated_at: new Date() },
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
