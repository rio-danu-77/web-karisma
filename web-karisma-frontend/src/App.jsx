// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function LayoutWithNavbar({ children }) {
  const { pathname } = useLocation()
  // daftar path yang TIDAK boleh pakai Navbar:
  const noNav = ['/login', '/register']
  return (
    <>
      {!noNav.includes(pathname) && <Navbar />}
      {children}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <LayoutWithNavbar>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </LayoutWithNavbar>
      </BrowserRouter>
    </AuthProvider>
  )
}
