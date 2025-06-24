// src/components/SpecialProgram.jsx
import React from 'react'
import programImage from '../assets/program-image.jpeg' // ganti dengan path foto kiri-mu

export default function SpecialProgram() {
  return (
    <section className="bg-[#F5F5FA] py-16">
      <div className="max-w-screen-xl mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-8 items-center">
        {/* Left image */}
        <div className="w-full">
          <img
            src={programImage}
            alt="Special Program"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Right text */}
        <div className="w-full space-y-6">
          <h2 className="text-4xl font-bold text-[#081D54]">
            Asah Skillmu secara Interaktif di Kelas
          </h2>
          <p className="text-lg text-gray-700">
            Program kelas reguler merupakan pelatihan online secara intensif dan live bersama mentor
            berpengalaman. Materi kursus dirancang secara terstruktur dari dasar hingga lanjut
            dengan standar industri terkini.
          </p>
          <button className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-300 transition">
            Join Now
          </button>
        </div>
      </div>
    </section>
  )
}
