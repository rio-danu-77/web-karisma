// src/pages/Home.jsx
import React, { useRef } from 'react'
import Hero from '../components/Hero'
import CourseCard from '../components/CourseCard'
import CarouselControls from '../components/CarouselControls'
import img1 from '../assets/course1.png'
import img2 from '../assets/course2.png'
import img3 from '../assets/course3.png'

// Dummy data 3 course contoh
const DUMMY_COURSES = [
  {
    id: 1,
    thumbnail: img1,
    title: 'Virtual Assistant & Remote Work Skills',
    duration: '3 atau 6 bulan',
    benefits: [
      'Manajemen waktu dan tugas (Trello, Asana)',
      'Komunikasi profesional (email, Zoom, Slack)',
      'Dasar-dasar administrasi dan keuangan (QuickBooks, Google Workspace)',
      'Peluang Karir (Virtual Assistant, Remote Project Manager)',
    ],
    buttonText: 'Detail Kursus'
  },
  {
    id: 2,
    thumbnail: img2,
    title: 'Bootcamp Full-Stack Web Development',
    duration: '3 atau 6 bulan',
    benefits: [
      'Dasar-dasar pemrograman (HTML, CSS, JS, Python)',
      'Framework React & Node.js',
      'Deploy & best practices',
      'Peluang Karir Web/Mobile Developer',
    ],
    buttonText: 'Join Now'
  },
  {
    id: 3,
    thumbnail: img3,
    title: 'Kursus Graphic Design & Branding',
    duration: 'Kelas terdekat: 14 Juni 2025',
    benefits: [
      'Potensi Penghasilan Menarik & Berkembang',
      'Tools: Photoshop, Illustrator, Figma',
      'Branding untuk startup & bisnis',
      'Portfolio & client project',
    ],
    buttonText: 'Detail Kursus'
  }
]

export default function Home() {
  const carouselRef = useRef(null)

  const scroll = delta => {
    carouselRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <>
      {/* Hero full-width */}
      <Hero />

      {/* Our Course Section */}
       <section className="relative -mt-12 pb-16">
        <div className="absolute inset-x-0 top-0 h-12 bg-[#F5F5FA]" />
        <div className="relative max-w-screen-xl mx-auto px-6 md:px-8 bg-white rounded-t-2xl pt-6">
          <h2 className="text-3xl font-bold text-center text-[#081D54] mb-4">Our Course</h2>

          <div
            ref={carouselRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4 auto-rows-fr"
          >
            {DUMMY_COURSES.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <CarouselControls onPrev={() => scroll(-300)} onNext={() => scroll(300)} />
          </div>
        </div>
      </section>
    </>
  )
}
