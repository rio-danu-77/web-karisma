// src/components/VideoSection.jsx
import React from 'react';
import introVideo from '../assets/Elysia Lucu.mp4';

export default function VideoSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#67B1FB] to-[#2F80ED]" />

      <div className="relative max-w-screen-xl mx-auto px-6 md:px-8 flex flex-col lg:flex-row items-start gap-8">
        {/* Video Lokal (60% width, 16:9 aspect) */}
        <div className="w-full lg:w-[60%]">
          <div className="relative w-full pb-[56.25%] rounded-3xl overflow-hidden border-2 border-white shadow-md">
            <video
              src={introVideo}
              controls
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Card Deskripsi (35% width, sedikit lebih tinggi) */}
        <div
          className="w-full lg:w-[35%] bg-white rounded-3xl border-2 border-white shadow-md p-6 flex flex-col"
          style={{ minHeight: '360px' }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-[#081D54] mb-6">
            Apa Tentang Kami Miaw-Miaw
          </h3>
          <p className="text-gray-800 flex-1 mb-6 leading-snug text-lg">
            Program kelas reguler merupakan pelatihan online secara intensif dan live bersama mentor berpengalaman. Materi dirancang terstruktur dari dasar hingga lanjut sesuai standar industri terkini.
          </p>
          <button className="mt-auto w-full bg-[#081D54] text-white py-3 rounded-lg font-semibold hover:bg-[#062147] transition">
            Tertarik Untuk Ikut Sekarang
          </button>
        </div>
      </div>
    </section>
  );
}
