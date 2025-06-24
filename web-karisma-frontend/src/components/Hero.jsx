// src/components/Hero.jsx
import React from 'react'
import heroImage from '../assets/hero-image.jpeg'
import robotImage from '../assets/robot.png'

export default function Hero() {
  return (
    <section className="w-full relative overflow-hidden bg-gradient-to-r from-[#67B1FB] to-[#2F80ED] pb-24">
      {/* Robot di background */}
      <img
        src={robotImage}
        alt="Robot"
        className="hidden md:block absolute bottom-0 left-0 w-[240px] lg:w-[260px] opacity-75 z-0"
        style={{ transform: 'translate(-10%, 10%)' }}
      />

      {/* Konten Hero */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between min-h-[520px] relative z-10">
        {/* Teks */}
        <div className="w-full md:w-1/2 text-white z-10 md:mt-12">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Asah Skillmu secara <br className="hidden md:block" />
            Interaktif di Kelas
          </h1>
          <p className="text-lg mb-6">
            Program kelas reguler online interaktif, intensif, dan live bersama mentor berpengalaman.
            Materi dirancang terstruktur dari dasar hingga lanjut sesuai standar industri.
          </p>
          <ul className="mb-6 space-y-2">
            <li className="flex items-center">
              <span className="text-green-200 text-xl mr-2">✔️</span>
              Belajar sistematis dan live
            </li>
            <li className="flex items-center">
              <span className="text-green-200 text-xl mr-2">✔️</span>
              Instruktur berpengalaman
            </li>
            <li className="flex items-center">
              <span className="text-green-200 text-xl mr-2">✔️</span>
              Publikasi siap kerja
            </li>
          </ul>
          <div className="flex gap-4">
            <button className="bg-white text-blue-700 font-semibold px-6 py-2 rounded-md shadow hover:bg-gray-100 transition">
              Konsultasi Karir
            </button>
            <button className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-md shadow hover:bg-yellow-300 transition">
              Join Us Now
            </button>
          </div>
        </div>

        {/* Gambar Hero */}
        <div className="w-full md:w-1/2 relative z-10 flex justify-end items-end mt-10 md:mt-0">
          <img
            src={heroImage}
            alt="Hero"
            className="w-[440px] h-auto object-cover rounded-xl shadow-xl"
          />
        </div>
      </div>
    </section>
  )
}
