// src/components/Hero.jsx
import React from 'react'
import heroImage from '../assets/hero-image.jpeg'
import robotImage from '../assets/robot.png'
import { FaCheckCircle } from 'react-icons/fa'

export default function Hero() {
  return (
    <section className="w-full relative overflow-hidden bg-gradient-to-r from-[#4EA0F8] via-[#67B1FB] to-[#2F80ED] pb-24">
      {/* Robot di background */}
      <img
        src={robotImage}
        alt="Robot"
        className="hidden md:block absolute bottom-0 left-0 w-[260px] lg:w-[300px] opacity-65 z-0"
        style={{ transform: 'translate(-20%, 15%)' }}
      />

      {/* Konten Hero */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between min-h-[560px] relative z-10">
        {/* Teks */}
        <div className="w-full md:w-1/2 text-white z-10 md:mt-16">
          <h1 className="text-5xl lg:text-6xl font-bold leading-snug mb-4">
            Asah Skillmu secara <br className="hidden md:block" />
            Interaktif di Kelas
          </h1>
          <p className="text-lg mb-6">
            Program kelas reguler online interaktif, intensif, dan live bersama mentor berpengalaman.
            Materi dirancang terstruktur dari dasar hingga lanjut sesuai standar industri.
          </p>
          <ul className="mb-6 space-y-3">
            {[
              'Belajar sistematis dan live',
              'Instruktur berpengalaman',
              'Publikasi siap kerja'
            ].map((text, i) => (
              <li key={i} className="flex items-center">
                <FaCheckCircle className="text-green-300 text-xl mr-2" />
                {text}
              </li>
            ))}
          </ul>
          <div className="flex gap-4">
            <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-md shadow hover:bg-gray-100 transition min-w-[150px]">
              Konsultasi Karir
            </button>
            <button className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-md shadow hover:bg-yellow-300 transition min-w-[150px]">
              Join Us Now
            </button>
          </div>
        </div>

        {/* Gambar Hero */}
        <div className="w-full md:w-1/2 relative z-10 flex justify-end items-end mt-10 md:mt-0">
          <img
            src={heroImage}
            alt="Hero"
            className="w-[440px] md:w-[500px] xl:w-[550px] h-auto object-cover rounded-xl shadow-xl"
          />
        </div>
      </div>
    </section>
  )
}
