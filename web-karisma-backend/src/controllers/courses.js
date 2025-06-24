// src/controllers/courses.js
const { Course } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil daftar courses' });
  }
};

exports.getById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course tidak ditemukan' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil course' });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      category_id, title, short_description, full_description,
      price, status, thumbnail_url, start_date, end_date, creator_id
    } = req.body;

    const course = await Course.create({
      category_id, title, short_description, full_description,
      price, status, thumbnail_url, start_date, end_date, creator_id
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: 'Gagal membuat course', detail: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course tidak ditemukan' });

    const updates = {};
    ['category_id','title','short_description','full_description',
     'price','status','thumbnail_url','start_date','end_date','creator_id']
      .forEach(f => { if (req.body[f]!==undefined) updates[f]=req.body[f] });

    await course.update(updates);
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: 'Gagal mengupdate course', detail: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course tidak ditemukan' });
    await course.destroy();
    res.json({ message: 'Course berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus course' });
  }
};
