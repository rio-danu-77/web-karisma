// src/seeders/02-demo-categories.js
const Category = require('../models/Category')

module.exports = async function seedCategories() {
  try {
    const categories = [
      { id: 1, name: 'Web Development', description: 'Kursus membuat website' },
      { id: 2, name: 'Design Graphic', description: 'Kursus desain grafis' },
      { id: 3, name: 'Digital Marketing', description: 'Kursus pemasaran digital' }
    ]

    for (const data of categories) {
      await Category.findOrCreate({
        where: { id: data.id },
        defaults: {
          name: data.name,
          description: data.description
        }
      })
    }

    console.log('✅ Seeder: Demo categories created or skipped')
  } catch (err) {
    console.error('❌ Seeder Error (Demo categories):', err)
  }
}
