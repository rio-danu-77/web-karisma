import React from 'react'
import imgTopLeft from '../assets/program-top-left.png'
import imgBottomRight from '../assets/program-bottom-right.png'
import robot from '../assets/robot2.png'
import bear from '../assets/bear.png'

export default function SpecialProgram() {
  return (
    <section className="relative bg-gradient-to-r from-[#67B1FB] to-[#2F80ED] py-24 overflow-hidden">
      {/* Robot kanan atas */}
      <img
        src={robot}
        alt="Robot"
        className="hidden lg:block absolute top-10 right-10 w-52 opacity-90 pointer-events-none z-0"
        style={{ transform: 'translate(10%, 0%)' }}
      />

      {/* Bear kiri bawah */}
      <img
        src={bear}
        alt="Bear"
        className="hidden lg:block absolute bottom-10 left-10 w-32 opacity-90 pointer-events-none z-0"
        style={{ transform: 'translate(-10%, 10%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
        {/* Top-left image */}
        <div className="rounded-[20px] overflow-hidden border-2 border-[#081D54] shadow-xl h-[220px]">
          <img
            src={imgTopLeft}
            alt="Program Left"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Top-right text card */}
        <div className="bg-[#CED9F2] border-2 border-[#081D54] rounded-[20px] p-6 flex flex-col justify-between h-[220px] shadow-xl">
          <h3 className="text-xl md:text-2xl font-bold text-[#081D54] mb-1">
            Asah Skillmu secara Interaktif di Kelas
          </h3>
          <p className="text-sm text-[#081D54] leading-relaxed mb-3">
            Program kelas reguler merupakan pelatihan online intensif dan live bersama mentor
            berpengalaman. Materi dirancang dari dasar hingga lanjut sesuai standar industri terkini.
          </p>
          <button className="bg-white text-[#081D54] border-2 border-[#081D54] py-2 rounded-md font-semibold hover:bg-gray-100 transition">
            Join Now
          </button>
        </div>

        {/* Title Tengah */}
        <div className="col-span-2 flex justify-center mt-10 mb-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#081D54] tracking-wide text-center">
            Our Special Program
          </h2>
        </div>

        {/* Bottom-left text card */}
        <div className="bg-[#CED9F2] border-2 border-[#081D54] rounded-[20px] p-6 flex flex-col justify-between h-[220px] shadow-xl">
          <h3 className="text-xl md:text-2xl font-bold text-[#081D54] mb-1">
            Asah Skillmu secara Interaktif di Kelas
          </h3>
          <p className="text-sm text-[#081D54] leading-relaxed mb-3">
            Program kelas reguler merupakan pelatihan online intensif dan live bersama mentor
            berpengalaman. Materi dirancang dari dasar hingga lanjut sesuai standar industri terkini.
          </p>
          <button className="bg-white text-[#081D54] border-2 border-[#081D54] py-2 rounded-md font-semibold hover:bg-gray-100 transition">
            Join Now
          </button>
        </div>

        {/* Bottom-right image */}
        <div className="rounded-[20px] overflow-hidden border-2 border-[#081D54] shadow-xl h-[220px]">
          <img
            src={imgBottomRight}
            alt="Program Right"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
