// src/components/Navbar.jsx
import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { AuthContext } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const linkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-md font-medium ${
      isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
    }`

  return (
    <nav className="sticky top-0 z-20 bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between h-16 px-6 md:px-8">
        {/* Logo */}
        <NavLink to="/">
          <img src={logo} alt="Karisma Academy" className="h-10" />
        </NavLink>

        {/* Navigasi di tengah */}
        <div className="flex-1 flex justify-center">
          {[
            { to: '/',         label: 'Home' },
            { to: '/programs', label: 'Program Kami' },
            { to: '/schedule', label: 'Jadwal' },
            { to: '/about',    label: 'Tentang' },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} className={linkClasses}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Tombol di kanan, dibuat lebih panjang */}
        <div className="flex items-center">
          {user ? (
            <button
              onClick={() => {
                logout()
                navigate('/', { replace: true })
              }}
              className="px-6 py-2 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login">
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
              >
                Log In
              </button>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
)
}
