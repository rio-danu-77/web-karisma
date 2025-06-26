import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import logo from '../assets/logo.png'

export default function Sidebar() {
  const { logout } = useContext(AuthContext)

  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col">
      <div className="p-6 flex items-center border-b border-blue-800">
        <img src={logo} alt="Logo" className="h-8 mr-2" />
        <span className="text-lg font-bold">Karisma</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {[
          { to: '/dashboard', label: 'Home' },
          { to: '/dashboard/profile', label: 'Profile' },
          { to: '/dashboard/courses', label: 'Kursus' },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md font-medium ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        className="m-4 bg-red-500 hover:bg-red-600 py-2 rounded-md font-medium"
      >
        Logout
      </button>
      <div className="mt-auto p-4 text-xs text-gray-300">
        © 2025 Karisma Academy
      </div>
    </aside>
  )
}
