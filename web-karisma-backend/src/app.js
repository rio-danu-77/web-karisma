const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const routes = require('./routes');
app.use('/api', routes);

// DB Sync
const { sequelize } = require('./models');

sequelize.sync({ alter: true }) // bisa diganti `force: true` untuk drop & create ulang
  .then(() => {
    console.log('✅ Database synced!');
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to sync database:', err);
  });
