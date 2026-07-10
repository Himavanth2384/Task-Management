import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

/**
 * AuthProvider — wraps the app and provides global auth state.
 * Persists token + user to localStorage for session continuity.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('tm_token'))
  const [loading, setLoading] = useState(true)

  // On mount: restore session from localStorage
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('tm_token')
      if (storedToken) {
        try {
          const data = await authService.getProfile()
          setUser(data.user)
        } catch {
          // Token expired or invalid — clear storage
          localStorage.removeItem('tm_token')
          setToken(null)
        }
      }
      setLoading(false)
    }
    restoreSession()
  }, [])

  const login = useCallback((userData, accessToken) => {
    setUser(userData)
    setToken(accessToken)
    localStorage.setItem('tm_token', accessToken)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('tm_token')
  }, [])

  const value = { user, token, loading, login, logout, isAuthenticated: !!token }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
