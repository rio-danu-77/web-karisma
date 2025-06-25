// src/pages/Home.jsx
import React, { useRef } from 'react';
import Hero from '../components/Hero';
import CourseCard from '../components/CourseCard';
import CarouselControls from '../components/CarouselControls';
import SpecialProgram from '../components/SpecialProgram';
import AboutUsCarousel from '../components/AboutUsCarousel';
import img1 from '../assets/course1.png';
import img2 from '../assets/course2.png';
import img3 from '../assets/course3.png';
import imgTopLeft from '../assets/program-top-left.png'
import imgBottomRight from '../assets/program-bottom-right.png'

// Dummy data untuk Our Course
const DUMMY_COURSES = [
  {
    id: 1,
    thumbnail: img1,
    title: 'Virtual Assistant & Remote Work Skills',
    duration: '3 atau 6 bulan',
    benefits: [
      'Manajemen waktu dan tugas (Trello, Asana)',
      'Komunikasi profesional (email, Zoom, Slack)',
      'Dasar-dasar administrasi dan keuangan',
      'Peluang Karir (VA, Remote Project Manager)',
    ],
    buttonText: 'Detail Kursus',
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
    buttonText: 'Detail Kursus',
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
    buttonText: 'Detail Kursus',
  },
];

export default function Home() {
  const courseRef = useRef(null);

  const scrollCourses = (delta) => {
    courseRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Hero Full-Width */}
      <Hero />

      {/* 2. Our Course */}
      <section className="relative -mt-12 pb-16">
        <div className="absolute inset-x-0 top-0 h-12 bg-[#F5F5FA]" />
        <div className="relative max-w-screen-xl mx-auto px-6 md:px-8 bg-white rounded-t-2xl pt-6">
          <h2 className="text-3xl font-bold text-center text-[#081D54] mb-4">
            Our Course
          </h2>
          <div
            ref={courseRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4 auto-rows-fr"
          >
            {DUMMY_COURSES.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <CarouselControls
              onPrev={() => scrollCourses(-300)}
              onNext={() => scrollCourses(300)}
            />
          </div>
        </div>
      </section>

      {/* 3. Special Program */}
      <SpecialProgram />

      {/* 4. About Us Carousel */}
      <AboutUsCarousel />
    </>
  );
}
