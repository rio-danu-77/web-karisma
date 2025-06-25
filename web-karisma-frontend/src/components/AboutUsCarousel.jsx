// src/components/AboutUsCarousel.jsx
import React, { useState } from 'react'
import about1 from '../assets/about1.png'
import about2 from '../assets/about2.png'
import about3 from '../assets/about3.png'

const SLIDES = [about1, about2, about3]

export default function AboutUsCarousel() {
  const [idx, setIdx] = useState(0)

  const prev = () => setIdx(i => (i - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setIdx(i => (i + 1) % SLIDES.length)

  return (
    <section className="bg-[#F5F5FA] py-16">
      <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
      <div className="max-w-screen-md mx-auto relative">
        {/* Slides */}
        <div className="grid grid-cols-3 gap-4">
          {SLIDES.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`About ${i+1}`}
              className={`
                rounded-lg border-2 border-[#081D54] shadow-lg
                transition-opacity duration-500
                ${i === idx ? 'opacity-100' : 'opacity-40'}
              `}
            />
          ))}
        </div>

        {/* Prev/Next */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
        >
          ›
        </button>

        {/* Text below */}
        <p className="mt-8 text-center text-gray-700 px-4">
          Program kelas reguler merupakan pelatihan online secara intensif dan live bersama mentor berpengalaman. Materi kursus dirancang secara terstruktur dari dasar hingga lanjut dengan standar industri terkini.
        </p>
      </div>
    </section>
  )
}
