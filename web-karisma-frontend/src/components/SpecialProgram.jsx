// src/components/SpecialProgram.jsx
import React from 'react'
import imgTopLeft from '../assets/program-top-left.png'
import imgBottomRight from '../assets/program-bottom-right.png'
import robot from '../assets/robot2.png'
import bear from '../assets/bear.png'

export default function SpecialProgram() {
  return (
    <section className="relative bg-gradient-to-r from-[#67B1FB] to-[#2F80ED] py-28 overflow-hidden">
      {/* Robot dekorasi */}
      <img
        src={robot}
        alt="Robot"
        className="hidden lg:block absolute top-10 right-10 w-48 opacity-80 pointer-events-none"
        style={{ transform: 'translate(20%, -20%)' }}
      />
      {/* Bear dekorasi */}
      <img
        src={bear}
        alt="Bear"
        className="hidden lg:block absolute bottom-10 left-10 w-32 opacity-80 pointer-events-none"
        style={{ transform: 'translate(-20%, 20%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1. Gambar Top-Left */}
        <div className="h-[310px] rounded-2xl overflow-hidden border-2 border-[#081D54] shadow-lg">
          <img
            src={imgTopLeft}
            alt="Program Top Left"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 2. Card Teks Top-Right */}
        <div className="h-[260px] bg-[#CED9F2] rounded-2xl border-2 border-[#081D54] p-6 flex flex-col justify-between shadow-lg">
          <h3 className="text-2xl font-bold text-[#081D54]">
            Asah Skillmu secara <br /> Interaktif di Kelas
          </h3>
          <p className="text-sm text-[#081D54] leading-relaxed">
            Pelatihan online intensif & live bersama mentor berpengalaman.  
            Materi terstruktur dari dasar hingga lanjut sesuai standar industri.
          </p>
          <button className="mt-4 bg-white text-[#081D54] border-2 border-[#081D54] py-2 rounded-md font-semibold hover:bg-gray-100 transition">
            Join Now
          </button>
        </div>

        {/* 3. Judul Tengah */}
        <div className="col-span-2 flex justify-center items-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white text-center">
            Our Special Program
          </h2>
        </div>

        {/* 4. Card Teks Bottom-Left */}
        <div className="h-[260px] bg-[#CED9F2] rounded-2xl border-2 border-[#081D54] p-6 flex flex-col justify-between shadow-lg">
          <h3 className="text-2xl font-bold text-[#081D54]">
            Asah Skillmu secara <br /> Interaktif di Kelas
          </h3>
          <p className="text-sm text-[#081D54] leading-relaxed">
            Pelatihan online intensif & live bersama mentor berpengalaman.  
            Materi terstruktur dari dasar hingga lanjut sesuai standar industri.
          </p>
          <button className="mt-4 bg-white text-[#081D54] border-2 border-[#081D54] py-2 rounded-md font-semibold hover:bg-gray-100 transition">
            Join Now
          </button>
        </div>

        {/* 5. Gambar Bottom-Right */}
        <div className="h-[310px] rounded-2xl overflow-hidden border-2 border-[#081D54] shadow-lg">
          <img
            src={imgBottomRight}
            alt="Program Bottom Right"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
