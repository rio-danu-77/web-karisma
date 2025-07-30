// src/server.js
require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const { sequelize, User, Category } = require('./models');
const authenticate = require('./middleware/auth');

// Seeder demo
const seedUsers      = require('./seeders/01-demo-users');
const seedCategories = require('./seeders/02-demo-categories');

// Controller Webhook Midtrans
const paymentsCtrl = require('./controllers/payments');

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({ alter: true });
    console.log('🔄 Database synced (alter tables)');

    if (await User.count() === 0) {
      await seedUsers();
      console.log('🌱 Demo users seeded');
    }
    if (await Category.count() === 0) {
      await seedCategories();
      console.log('🌱 Demo categories seeded');
    }

    const app = express();

    app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

    app.post(
      '/api/payments/notification',
      express.json(), // WAJIB! biar Midtrans bisa parsing payload
      paymentsCtrl.handleNotification
    );

    // Middleware JSON untuk semua route lainnya
    app.use(express.json());

    // Upload static files
    app.use('/uploads', express.static('uploads'));

    // Health check
    app.get('/healthz', (req, res) => res.send('OK'));

    // Routes
    app.use('/api/auth',  require('./routes/authRoutes'));
    app.use('/api/users', authenticate, require('./routes/users'));
    app.use('/api/courses', require('./routes/courses'));
    app.use(
      '/api/courses/:courseId/sessions/:sessionId/lessons',
      authenticate,
      require('./routes/lessons')
    );
    app.use('/api/enrollments',     authenticate, require('./routes/enrollments'));
    app.use('/api/lesson-progress', authenticate, require('./routes/lessonProgress'));
    app.use('/api/quizzes',         authenticate, require('./routes/quizzes'));
    app.use('/api/quiz-options',    authenticate, require('./routes/quizOptions'));
    app.use('/api/user-answers',    authenticate, require('./routes/userQuizAnswers'));
    app.use('/api/messages',        authenticate, require('./routes/messages'));
    app.use('/api/notifications',   authenticate, require('./routes/notifications'));

    // ✅ Payment routes (checkout, crud, confirm, etc)
    app.use('/api/payments', require('./routes/payments'));

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ message: 'Endpoint tidak ditemukan' });
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error('🔥 Unhandled Error:', err);
      res.status(500).json({ message: 'Internal server error' });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Gagal memulai server:', err);
    process.exit(1);
  }
}

start();
