const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports = async function seedUsers() {
  const hash1 = await bcrypt.hash('miaw10', 10)
  const hash2 = await bcrypt.hash('atmin123', 10)
  const hash3 = await bcrypt.hash('malas00', 10)
  const hash4 = await bcrypt.hash('raja99', 10)
  const now = new Date()

  await User.bulkCreate([
    {
      name:       'Kucing',
      email:      'user@email.com',
      password:   hash1,
      role:       'user',
      birth_date: '2000-01-01',
      domicile:   'Amphoreus',
      avatar_url: 'https://id.pinterest.com/pin/305752262218375074/',
      createdAt: now,
      updatedAt: now
    },
    {
      name:       'Atmind',
      email:      'admin@email.com',
      password:   hash2,
      role:       'admin',
      birth_date: '1990-05-15',
      domicile:   'Bandung',
      avatar_url: 'https://id.pinterest.com/pin/115827021661502767/',
      createdAt: now,
      updatedAt: now
    },
    {
      name:       'Kawasaki Endou',
      email:      'user2@email.com',
      password:   hash3,
      role:       'user',
      birth_date: '1995-07-20',
      domicile:   'New Eridu',
      avatar_url: 'https://id.pinterest.com/pin/115827021661502767/',
      createdAt: now,
      updatedAt: now
    },
    {
      name:       'Aku Atmint',
      email:      'admin2@email.com',
      password:   hash4,
      role:       'admin',
      birth_date: '1985-11-30',
      domicile:   'Malang',
      avatar_url: 'https://id.pinterest.com/pin/115827021661502767/',
      createdAt: now,
      updatedAt: now
    }
  ], {
    ignoreDuplicates: true
  })

  console.log('✅ Seeder: Demo users (4 akun) created or skipped if existed')
  console.log('ℹ️  Admin login: admin@email.com | atmin123')
  console.log('ℹ️  Admin login: admin2@email.com | raja99')
}
