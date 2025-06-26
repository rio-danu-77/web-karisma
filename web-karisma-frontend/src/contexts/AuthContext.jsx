// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { getCurrentUser, logout as doLogout } from '../services/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = getCurrentUser();
    if (u) setUser(u);
  }, []);

  const loginUser = async creds => {
    // panggil service.login (sync)
    const { login } = await import('../services/auth');
    const u = login(creds);
    if (u) setUser(u);
    return u;
  };

  const logout = () => {
    doLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login: loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
