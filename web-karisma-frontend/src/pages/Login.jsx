// src/pages/Login.jsx
// src/pages/Login.jsx
import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/auth'
import { AuthContext } from '../contexts/AuthContext'
import robotImg from '../assets/robot3.png'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const { user, login }         = useContext(AuthContext)
  const nav = useNavigate()

  useEffect(() => {
    if (user) nav('/dashboard', { replace: true })
  }, [user, nav])

  const handleSubmit = async e => {
    e.preventDefault()
    const u = await login({ email, password })
    if (!u) setError('Email atau password salah.')
  }

  return (
    <div className="flex min-h-screen">
      {/* Kiri: ilustrasi, hanya tampil di desktop */}
      <div className="hidden lg:flex w-1/2 bg-[#67B1FB] items-center justify-center">
        <img
          src={robotImg}
          alt="Karisma Hero"
          className="max-w-md w-full object-contain"
        />
      </div>

      {/* Kanan: form login */}
      <div className="flex flex-1 items-center justify-center bg-[#F7F2E9] px-6">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Log In</h1>

          {error && (
            <p className="text-red-600 mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#4F46E5] text-white py-3 rounded-lg font-semibold hover:bg-[#4338CA] transition"
            >
              Log In
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Buat Akun Baru
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
