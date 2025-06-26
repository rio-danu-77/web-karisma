// src/pages/Register.jsx
import { Link } from 'react-router-dom'
import robotImg from '../assets/robot3.png'  // sama seperti di Login

export default function Register() {
  return (
    <div className="flex min-h-screen">
      {/* Kiri: gambar */}
      <div className="hidden lg:flex w-1/2 bg-[#67B1FB] items-center justify-center">
        <img
          src={robotImg}
          alt="Karisma Hero"
          className="max-w-md w-full object-contain"
        />
      </div>

      {/* Kanan: form */}
      <div className="flex flex-1 items-center justify-center bg-[#F7F2E9] px-6">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
          <form className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#4F46E5] text-white py-3 rounded-lg font-semibold hover:bg-[#4338CA] transition"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log In Disini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
