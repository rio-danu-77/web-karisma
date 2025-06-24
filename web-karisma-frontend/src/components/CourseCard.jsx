// src/components/CourseCard.jsx
export default function CourseCard({ course }) {
  return (
    <div className="h-full flex flex-col justify-between min-w-[300px] bg-[#CED9F2] rounded-xl border border-black p-4 snap-center">
      {/* Wrapper flex grow untuk konten atas */}
      <div className="flex gap-4 mb-4">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-24 h-24 object-cover rounded-lg border border-black"
        />
        <div>
          <h3 className="text-xl font-extrabold text-[#081D54]">
            {course.title}
          </h3>
          <p className="text-sm text-[#081D54] mt-1">{course.duration}</p>
        </div>
      </div>

      {/* Konten utama */}
      <div className="flex-1 text-[#081D54] text-sm">
        <p className="font-semibold mb-2">Keuntungan Kursus ini Cocok untuk:</p>
        <ul className="space-y-1 list-none pl-4">
          {course.benefits.map((b, i) => (
            <li key={i} className="before:content-['☑️'] before:mr-2">
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Tombol di paling bawah */}
      <button className="mt-6 w-full bg-white border border-black rounded-lg py-2 font-semibold text-[#081D54] hover:bg-gray-100 transition">
        {course.buttonText}
      </button>
    </div>
  );
}
