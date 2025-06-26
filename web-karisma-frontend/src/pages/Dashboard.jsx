// src/pages/Dashboard.jsx
import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import { AuthContext } from '../contexts/AuthContext'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function Dashboard() {
  const { user } = useContext(AuthContext)
  const activeCourses = [
    { title: 'Desain UI/UX', progress: 20 },
    { title: 'Pemrograman Next.js', progress: 80 },
    { title: 'Data Science', progress: 45 }
  ]
  const upcoming = [
    { date: '18 Jun 2025', desc: 'Kuis Modul 3', status: 'Mendatang' },
    { date: '20 Jun 2025', desc: 'Live Workshop Figma', status: 'Join' },
    { date: '25 Jun 2025', desc: 'Submit Project Akhir', status: 'Pending' }
  ]
  const statsData = [
    { name: 'UI/UX', value: 20 },
    { name: 'Next.js', value: 80 },
    { name: 'Data Sci.', value: 45 }
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar kiri */}
      <Sidebar />

      {/* Konten utama */}
      <main className="flex-1 p-8 space-y-8">
        {/* Header sapaan */}
        <header>
          <h1 className="text-3xl font-bold mb-2">
            Hai, {user.name} 👋
          </h1>
          <p className="text-gray-600">Selamat datang di dashboard Anda.</p>
        </header>

        {/* Kursus Aktif & Jadwal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Kursus Aktif */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">📋</span>
              Kursus Aktif
            </h2>
            <ul className="space-y-4">
              {activeCourses.map((c, i) => (
                <li key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{c.title}</span>
                    <button className="text-blue-600 hover:underline text-sm">
                      Lanjutkan
                    </button>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-600 rounded-full"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Jadwal */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">📅</span>
              Jadwal Mendatang
            </h2>
            <ul className="space-y-3">
              {upcoming.map((e, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <div>
                    <span className="font-semibold mr-2">{e.date}</span>
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

        {/* Statistik Anda */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Statistik Anda
          </h2>
          <div className="w-full h-52 bg-white bg-opacity-20 rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData}>
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e3a8a' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" fill="#fff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  )
}
