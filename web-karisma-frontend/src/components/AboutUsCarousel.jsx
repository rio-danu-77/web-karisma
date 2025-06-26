// src/components/AboutUsCarousel.jsx
import React, { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import img1 from '../assets/about1.png'
import img2 from '../assets/about2.png'
import img3 from '../assets/about3.png'

// Array gambar
const SLIDES = [img1, img2, img3]

// Deskripsi per gambar
const DESCRIPTIONS = [
  'Kelas intensif online dengan mentor profesional, fokus pada pengembangan skill teknis dan soft skill.',
  'Materi terstruktur mulai dari dasar hingga mahir, dilengkapi studi kasus industri nyata.',
  'Dukungan komunitas & portofolio project untuk memudahkan kamu memasuki dunia kerja.'
]

export default function AboutUsCarousel() {
  const [current, setCurrent] = useState(1)

  const prev = () =>
    setCurrent(i => (i - 1 + SLIDES.length) % SLIDES.length)
  const next = () =>
    setCurrent(i => (i + 1) % SLIDES.length)

  return (
    <section className="relative bg-[#F5F5FA] py-20 px-4">
      {/* Badge “About Us” */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                      bg-white px-8 py-3 rounded-full shadow-md border border-gray-200
                      text-[#081D54] font-extrabold text-2xl">
        About Us
      </div>

      <div className="max-w-screen-lg mx-auto mt-8">
        {/* Carousel */}
        <div className="relative flex items-center justify-center">
          {/* Prev */}
          <button
            onClick={prev}
            className="absolute left-0 text-4xl text-gray-700 hover:text-black"
            aria-label="Previous"
          >
            <FaChevronLeft />
          </button>

          {/* Slides */}
          <div className="flex items-center gap-6">
            {/* Left small */}
            <img
              src={SLIDES[(current - 1 + SLIDES.length) % SLIDES.length]}
              alt="About us side"
              className="w-40 h-40 object-cover rounded-lg opacity-50"
            />
            {/* Center large */}
            <img
              src={SLIDES[current]}
              alt="About us main"
              className="w-72 h-72 object-cover rounded-xl border-4 border-[#081D54] shadow-xl"
            />
            {/* Right small */}
            <img
              src={SLIDES[(current + 1) % SLIDES.length]}
              alt="About us side"
              className="w-40 h-40 object-cover rounded-lg opacity-50"
            />
          </div>

          {/* Next */}
          <button
            onClick={next}
            className="absolute right-0 text-4xl text-gray-700 hover:text-black"
            aria-label="Next"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Judul & Paragraf Dinamis */}
        <div className="mt-10 text-center px-6">
          <h3 className="text-3xl font-extrabold text-[#081D54] mb-4">
            Information About Us
          </h3>
          <p className="text-[#2F80ED] max-w-2xl mx-auto leading-relaxed text-xl">
            {DESCRIPTIONS[current]}
          </p>
        </div>
      </div>
    </section>
  )
}
