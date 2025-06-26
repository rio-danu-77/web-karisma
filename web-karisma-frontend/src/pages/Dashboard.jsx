// src/pages/Dashboard.jsx
import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import logo from '../assets/logo.png'

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  // Contoh data statis untuk user
  const activeCourses = [
    { title: 'Desain UI/UX',    progress: 45 },
    { title: 'Next.js & React', progress: 80 },
    { title: 'Data Science',    progress: 30 },
  ]
  const upcoming = [
    { date: '18 Jun 2025', desc: 'Kuis Modul 3', status: 'Mendatang' },
    { date: '20 Jun 2025', desc: 'Live Workshop Figma', status: 'Join' },
    { date: '25 Jun 2025', desc: 'Submit Project Akhir', status: 'Pending' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 flex items-center border-b border-blue-800">
          <img src={logo} alt="Logo" className="h-8 mr-2" />
          <span className="text-lg font-bold">Karisma</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { to: '/dashboard',        label: 'Home' },
            { to: '/dashboard/profile',label: 'Profile' },
            { to: '/dashboard/courses',label: 'Kursus' },
            { to: '/dashboard/settings', label: 'Pengaturan' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md font-medium ${
                  isActive ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 bg-red-500 hover:bg-red-600 py-2 rounded-md font-medium"
        >
          Logout
        </button>
        <div className="mt-auto p-4 text-xs text-gray-300">
          © 2025 Karisma Academy
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold">
            Hai, {user.name} 👋
          </h1>
          <p className="text-gray-600">
            Anda login sebagai <strong>{user.role}</strong>
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Kursus Aktif */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Kursus Aktif</h2>
            <ul className="space-y-4">
              {activeCourses.map((c, i) => (
                <li key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{c.title}</span>
                    <button className="text-blue-600 hover:underline text-sm">
                      Lanjutkan
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Jadwal Mendatang */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Jadwal Mendatang</h2>
            <ul className="space-y-3">
              {upcoming.map((e, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <div>
                    <span className="font-semibold">{e.date}</span>{' '}
                    <span className="text-gray-600">{e.desc}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      e.status === 'Mendatang'
                        ? 'bg-yellow-100 text-yellow-800'
                        : e.status === 'Join'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {e.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Statistik */}
        <section className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Statistik Anda</h2>
          <div className="h-48 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            {/* Nantinya bisa ganti dengan chart Recharts */}
            <span className="text-lg">[Chart Placeholder]</span>
          </div>
        </section>
      </main>
    </div>
)
}
