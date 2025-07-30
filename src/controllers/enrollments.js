const {
  Enrollment,
  Course,
  Session,
  Lesson,
  LessonProgress,
  User,
  Notification,
  sequelize
} = require('../models');
const { Op } = require('sequelize');

// 📥 Admin: lihat semua enrollment
exports.getAll = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Hanya admin yang dapat mengakses semua enrollment' });
  }
  try {
    const data = await Enrollment.findAll({
      include: [
        { model: User,   as: 'user',   attributes: ['id', 'name', 'email'] },
        { model: Course, as: 'course', attributes: ['id', 'title', 'price', 'thumbnail_url'] }
      ],
      order: [['enrolled_at', 'DESC']]
    });
    res.json({ success: true, data });
  } catch (err) {
    console.error('❌ getAll enrollments error:', err);
    res.status(500).json({ success: false, error: 'Gagal mengambil semua enrollment', detail: err.message });
  }
};

// 📄 User/Admin: detail enrollment by enrollment ID
exports.getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const where = req.user.role === 'admin'
      ? { id }
      : { id, user_id: req.user.id };

    const enrollment = await Enrollment.findOne({
      where,
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title', 'thumbnail_url', 'price'] }
      ]
    });
    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Enrollment tidak ditemukan' });
    }
    res.json({ success: true, data: enrollment });
  } catch (err) {
    console.error('❌ getById enrollment error:', err);
    res.status(500).json({ success: false, error: 'Gagal mengambil detail enrollment', detail: err.message });
  }
};

// 📥 Admin: daftar peserta suatu course
exports.getByCourseAdmin = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Hanya admin yang dapat mengakses enrollment per course' });
  }
  const courseId = Number(req.params.courseId);
  try {
    const data = await Enrollment.findAll({
      where: { course_id: courseId },
      include: [
        { model: User,   as: 'user',   attributes: ['id', 'name', 'email'] },
        { model: Course, as: 'course', attributes: ['id', 'title', 'price'] }
      ],
      order: [['enrolled_at', 'DESC']]
    });
    res.json({ success: true, data });
  } catch (err) {
    console.error('❌ getByCourseAdmin error:', err);
    res.status(500).json({ success: false, error: 'Gagal mengambil enrollment per course', detail: err.message });
  }
};

// ✍️ User: daftar ke kursus + notifikasi
exports.enrollCourse = async (req, res) => {
  const userId = req.user.id;
  const { course_id } = req.body;

  if (!course_id) {
    return res.status(400).json({ success: false, error: 'Field course_id wajib diisi' });
  }

  const t = await sequelize.transaction();
  try {
    const course = await Course.findByPk(course_id, { transaction: t });
    if (!course) {
      await t.rollback();
      return res.status(404).json({ success: false, error: 'Kursus tidak ditemukan' });
    }

    const exist = await Enrollment.findOne({ where: { user_id: userId, course_id }, transaction: t });
    if (exist) {
      await t.rollback();
      return res.status(409).json({ success: false, error: 'Anda sudah terdaftar di kursus ini' });
    }

    const created = await Enrollment.create({
      user_id: userId,
      course_id,
      status: 'in_progress',
      progress: 0,
      enrolled_at: new Date()
    }, { transaction: t });

    await Notification.create({
      user_id: userId,
      type: 'success',
      content: `Anda berhasil mendaftar kursus "${course.title}". Selamat belajar!`,
      status: 'unread',
      created_at: new Date()
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ success: true, message: 'Berhasil mendaftar kursus', enrollment: created });
  } catch (err) {
    await t.rollback();
    console.error('❌ enrollCourse error:', err);
    res.status(500).json({ success: false, error: 'Gagal daftar kursus', detail: err.message });
  }
};

// 📥 User: lihat kursus yang diikuti
exports.getMyEnrollments = async (req, res) => {
  try {
    const data = await Enrollment.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title', 'thumbnail_url', 'price'] }
      ],
      order: [['enrolled_at', 'DESC']]
    });
    res.json({ success: true, data });
  } catch (err) {
    console.error('❌ getMyEnrollments error:', err);
    res.status(500).json({ success: false, error: 'Gagal mengambil kursus yang diikuti', detail: err.message });
  }
};

// 📥 Admin: lihat enrollment milik user tertentu
exports.getByUser = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Hanya admin yang dapat mengakses enrollment per user' });
  }
  try {
    const data = await Enrollment.findAll({
      where: { user_id: req.params.userId },
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title', 'thumbnail_url', 'price'] },
        { model: User,   as: 'user',   attributes: ['id', 'name', 'email'] }
      ],
      order: [['enrolled_at', 'DESC']]
    });
    if (!data.length) {
      return res.status(404).json({ success: false, message: 'User belum mengikuti kursus apapun' });
    }
    res.json({ success: true, data });
  } catch (err) {
    console.error('❌ getByUser error:', err);
    res.status(500).json({ success: false, error: 'Gagal mengambil enrollment user', detail: err.message });
  }
};

// 📄 User: detail enrollment berdasarkan courseId
exports.getByCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);
    const userId   = req.user.id;

    const data = await Enrollment.findOne({
      where: { user_id: userId, course_id: courseId },
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title', 'thumbnail_url', 'price'] }
      ]
    });
    if (!data) {
      return res.status(404).json({ success: false, message: 'Anda belum terdaftar di kursus ini' });
    }
    res.json({ success: true, data });
  } catch (err) {
    console.error('❌ getByCourse error:', err);
    res.status(500).json({ success: false, error: 'Gagal mengambil detail enrollment', detail: err.message });
  }
};

// 📈 User: ambil hanya progress & status via courseId
exports.getMyProgressByCourse = async (req, res) => {
  try {
    const data = await Enrollment.findOne({
      where: {
        user_id:   req.user.id,
        course_id: Number(req.params.courseId)
      },
      attributes: ['progress', 'status', 'completed_at']
    });
    if (!data) {
      return res.status(404).json({ success: false, message: 'Belum ada progress untuk kursus ini' });
    }
    res.json({ success: true, data });
  } catch (err) {
    console.error('❌ getMyProgressByCourse error:', err);
    res.status(500).json({ success: false, error: 'Gagal mengambil progress', detail: err.message });
  }
};

// 🧩 User: lihat progress per sesi
exports.getProgressMap = async (req, res) => {
  const { id }    = req.params;  // enrollment ID
  const userId    = req.user.id; // logged-in user

  try {
    // 1) Verifikasi ownership & dapatkan course_id
    const enrollment = await Enrollment.findOne({
      where: { id: Number(id), user_id: userId }
    });
    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Enrollment tidak ditemukan' });
    }
    const courseId = enrollment.course_id;

    // 2) Ambil semua sesi untuk course
    const sessions = await Session.findAll({
      where: { course_id: courseId },
      attributes: ['id']
    });

    // 3) Hitung progress tiap sesi
    const progressMap = {};
    for (const { id: sessionId } of sessions) {
      // Ambil semua lesson ID
      const lessonIds = (await Lesson.findAll({
        where: { session_id: sessionId },
        attributes: ['id']
      })).map(l => l.id);

      // Hitung watched lessons
      const watched = lessonIds.length
        ? await LessonProgress.count({
            where: {
              lesson_id: { [Op.in]: lessonIds },
              user_id: userId
            }
          })
        : 0;

      // Hitung persen
      progressMap[sessionId] = lessonIds.length
        ? Math.round((watched / lessonIds.length) * 100)
        : 0;
    }

    return res.json({ success: true, data: progressMap });
  } catch (err) {
    console.error('❌ getProgressMap error:', err);
    return res.status(500).json({ success: false, error: 'Gagal mengambil progress sesi', detail: err.message });
  }
};

// 📝 User/Admin: ambil progress & status via enrollment ID
exports.getProgressById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const where = req.user.role === 'admin'
      ? { id }
      : { id, user_id: req.user.id };

    const enrollment = await Enrollment.findOne({
      where,
      attributes: ['progress', 'status', 'completed_at']
    });
    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Enrollment tidak ditemukan' });
    }
    res.json({ success: true, data: enrollment });
  } catch (err) {
    console.error('❌ getProgressById error:', err);
    res.status(500).json({ success: false, error: 'Gagal mengambil progress enrollment', detail: err.message });
  }
};

// 📝 User: tandai satu sesi selesai (POST /api/enrollments/:id/progress)
exports.markSessionProgress = async (req, res) => {
  const enrollmentId = Number(req.params.id);
  const userId       = req.user.id;
  const { sessionId } = req.body;

  try {
    // Pastikan enrollment milik user ini
    const enrollment = await Enrollment.findOne({
      where: { id: enrollmentId, user_id: userId }
    });
    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Enrollment tidak ditemukan' });
    }

    // TODO: simpan ke tabel pivot EnrollmentSession jika ada.
    // Contoh (jika pakai model EnrollmentSession):
    // await EnrollmentSession.findOrCreate({
    //   where: { enrollment_id: enrollmentId, session_id: sessionId },
    //   defaults: { completed: true }
    // });

    return res.json({ success: true, message: 'Sesi berhasil ditandai selesai' });
  } catch (err) {
    console.error('❌ markSessionProgress error:', err);
    return res.status(500).json({ success: false, error: 'Gagal menandai sesi selesai', detail: err.message });
  }
};

// ✏️ User/Admin: update progress atau status (PATCH /:id/progress & PUT /:id)
exports.updateEnrollment = async (req, res) => {
  try {
    const item = await Enrollment.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Enrollment tidak ditemukan' });
    }
    if (req.user.role !== 'admin' && item.user_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Tidak diizinkan mengubah enrollment ini' });
    }

    const { progress, status, completed_at } = req.body;
    const updates = {};

    if (progress != null) {
      const v = parseInt(progress);
      if (isNaN(v) || v < 0 || v > 100) {
        return res.status(400).json({ success: false, error: 'Progress harus 0–100' });
      }
      updates.progress = v;
      if (v === 100) {
        updates.status = 'completed';
        updates.completed_at = new Date();
        await Notification.create({
          user_id: item.user_id,
          type: 'success',
          content: `Selamat! Anda telah menyelesaikan kursus #${item.course_id}.`,
          status: 'unread',
          created_at: new Date()
        });
      }
    }
    if (status)       updates.status       = status;
    if (completed_at) updates.completed_at = completed_at;

    await item.update(updates);
    res.json({ success: true, message: 'Enrollment diperbarui', enrollment: item });
  } catch (err) {
    console.error('❌ updateEnrollment error:', err);
    res.status(500).json({ success: false, error: 'Gagal memperbarui enrollment', detail: err.message });
  }
};

// 🗑️ Admin only: hapus enrollment
exports.deleteEnrollment = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Hanya admin yang dapat menghapus enrollment' });
  }
  try {
    const item = await Enrollment.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Enrollment tidak ditemukan' });
    }
    await item.destroy();
    res.json({ success: true, message: 'Enrollment berhasil dihapus' });
  } catch (err) {
    console.error('❌ deleteEnrollment error:', err);
    res.status(500).json({ success: false, error: 'Gagal menghapus enrollment', detail: err.message });
  }
};
