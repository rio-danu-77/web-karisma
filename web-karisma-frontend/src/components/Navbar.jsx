import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { AuthContext } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  return (
    <nav className="sticky top-0 z-20 bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-6 md:px-8 flex items-center justify-between h-16">
        <NavLink to="/"><img src={logo} alt="Karisma Academy" className="h-10" /></NavLink>
        <div className="hidden md:flex items-center space-x-6">
          {['/', '/programs', '/schedule', '/about'].map((to,i) => (
            <NavLink
              key={to}
              to={to}
              className={({isActive})=> isActive ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}
            >
              {['Home','Program Kami','Jadwal','Tentang'][i]}
            </NavLink>
          ))}
        </div>
        {user
          ? <button
              onClick={()=>{ logout(); nav('/'); }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >Logout</button>
          : <NavLink
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
            >Log In</NavLink>
        }
      </div>
    </nav>
  );
}
