// src/pages/Register.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/auth'
import robotImg from '../assets/robot3.png'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = e => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return setError('Password dan konfirmasi tidak cocok.')
    }
    // panggil service register (dummy atau API)
    const ok = register({ name, email, password })
    if (ok) {
      navigate('/login')
    } else {
      setError('Gagal mendaftar. Coba lagi.')
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Gambar samping */}
      <div className="hidden lg:flex w-1/2 bg-[#67B1FB] items-center justify-center">
        <img
          src={robotImg}
          alt="Karisma Hero"
          className="max-w-md w-full object-contain"
        />
      </div>

      {/* Form register */}
      <div className="flex flex-1 items-center justify-center bg-[#F7F2E9] px-6">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

          {error && (
            <p className="text-red-600 mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Lengkap */}
            <div>
              <label className="block mb-1 font-medium">Nama Anda</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Tombol Sign Up */}
            <button
              type="submit"
              className="w-full bg-[#4F46E5] text-white py-3 rounded-lg font-semibold hover:bg-[#4338CA] transition"
            >
              Sign Up
            </button>
          </form>

          {/* Link ke Login */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log In di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
