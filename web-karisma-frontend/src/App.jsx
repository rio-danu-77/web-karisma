import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar selalu di paling atas */}
      <Navbar />

      {/* Rute: hanya render Home (yang sudah include Hero) */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Tambahkan route lain di sini */}
      </Routes>
    </BrowserRouter>
  );
}
