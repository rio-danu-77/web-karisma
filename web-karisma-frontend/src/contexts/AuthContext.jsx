// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react'
import { getCurrentUser as authGetCurrentUser, logout as authLogout } from '../services/auth'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = authGetCurrentUser()
    if (u) setUser(u)
  }, [])

  const logout = () => {
    authLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
