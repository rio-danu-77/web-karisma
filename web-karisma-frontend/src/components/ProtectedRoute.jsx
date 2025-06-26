// src/components/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) {
    // jika belum login → redirect ke /login
    return <Navigate to="/login" replace />;
  }
  return children;
}
