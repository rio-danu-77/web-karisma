const { validationResult } = require('express-validator')
const Course              = require('../models/Course')
const Category            = require('../models/Category')
const { Session, Lesson } = require('../models')

// List courses (GET /api/courses?limit=3)
exports.list = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin'
    const where   = isAdmin ? {} : { status: 'active' }
    const limit   = req.query.limit ? +req.query.limit : null

    const courses = await Course.findAll({
      where, order:[['created_at','DESC']],
      ...(limit && { limit }),
      attributes: ['id','title','description','price','status','thumbnail_url','start_date','end_date','created_at'],
      include: [
        { model: Category, as:'category', attributes:['name'] },
        { model: Session,  as:'sessions', attributes:['id'], include:[{ model:Lesson, as:'lessons', attributes:['id'] }] }
      ]
    })

    const result = courses.map(c => {
      const js = c.toJSON()
      const sess = js.sessions || []
      const lessons = sess.flatMap(s=>s.lessons)
      return {
        id: js.id, title: js.title, description: js.description,
        price: js.price, status: js.status,
        thumbnail_url: js.thumbnail_url,
        start_date: js.start_date, created_at: js.created_at,
        category: js.category?.name || '—',
        sessions_count: sess.length,
        lessons_count: lessons.length
      }
    })
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message:'Gagal mengambil data kursus' })
  }
}

// Show single course (GET /api/courses/:id)
exports.show = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      attributes:['id','title','description','price','status','thumbnail_url','start_date','end_date','created_at'],
      include:[{ model:Category, as:'category', attributes:['name']}]
    })
    if (!course) return res.status(404).json({ message:'Kursus tidak ditemukan' })
    if (course.status!=='active' && req.user?.role!=='admin')
      return res.status(403).json({ message:'Kursus tidak tersedia' })

    const js = course.toJSON()
    js.category = js.category?.name||'—'
    res.json(js)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message:'Gagal mengambil detail kursus' })
  }
}

// Full detail with sessions & lessons (GET /api/courses/:id/full)
exports.full = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      attributes:['id','title','description','price','status','thumbnail_url','start_date','end_date','created_at'],
      include:[
        { model:Category, as:'category', attributes:['name'] },
        { model:Session,  as:'sessions', attributes:['id','title','order_index'],
          include:[{ model:Lesson, as:'lessons', attributes:['id','title','content','video_url','order_number'] }]
        }
      ]
    })
    if (!course) return res.status(404).json({ message:'Kursus tidak ditemukan' })
    if (course.status!=='active' && req.user?.role!=='admin')
      return res.status(403).json({ message:'Kursus tidak tersedia' })

    const js = course.toJSON()
    // Urutkan
    js.sessions.sort((a,b)=>a.order_index-b.order_index)
    js.sessions.forEach(s=>s.lessons.sort((x,y)=>x.order_number-y.order_number))
    js.category = js.category?.name||'—'
    res.json(js)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message:'Gagal mengambil data lengkap kursus' })
  }
}

// Create course (POST /api/courses)
exports.create = async (req, res) => {
  const errs = validationResult(req)
  if (!errs.isEmpty()) return res.status(422).json({ errors:errs.array() })

  try {
    const { title, description='', category_id, price, status, start_date=null, end_date=null } = req.body
    const thumbnail_url = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : null

    const course = await Course.create({ title, description, category_id: +category_id||null, price, status, thumbnail_url, start_date, end_date })
    res.status(201).json(course)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message:'Gagal membuat kursus' })
  }
}

// Update course (PUT /api/courses/:id)
exports.update = async (req, res) => {
  const errs = validationResult(req)
  if (!errs.isEmpty()) return res.status(422).json({ errors:errs.array() })

  try {
    const course = await Course.findByPk(req.params.id)
    if (!course) return res.status(404).json({ message:'Kursus tidak ditemukan' })

    const { title, description='', category_id, price, status, start_date=null, end_date=null } = req.body
    if (req.file)
      course.thumbnail_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

    course.title = title; course.description = description;
    course.category_id = +category_id||null; course.price = price;
    course.status = status; course.start_date = start_date;
    course.end_date = end_date
    await course.save()
    res.json(course)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message:'Gagal update kursus' })
  }
}

// Delete course (DELETE /api/courses/:id)
exports.destroy = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id)
    if (!course) return res.status(404).json({ message:'Kursus tidak ditemukan' })
    await course.destroy()
    res.json({ message:'Kursus berhasil dihapus' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message:'Gagal menghapus kursus' })
  }
}
