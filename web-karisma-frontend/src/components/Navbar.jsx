import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Navbar() {
  return (
    <nav className="relative z-20 w-full bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-6 md:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Karisma Academy" className="h-10" />
        </Link>

        {/* Links tanpa ikon */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </Link>
          <Link to="/programs" className="text-gray-700 hover:text-blue-600 font-medium">
            Program Kami
          </Link>
          <Link to="/schedule" className="text-gray-700 hover:text-blue-600 font-medium">
            Jadwal
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">
            Tentang
          </Link>
        </div>

        {/* Tombol Login */}
        <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 font-medium">
          Log In
        </button>
      </div>
    </nav>
    );
}