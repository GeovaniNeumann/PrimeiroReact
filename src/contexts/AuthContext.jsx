import React, { createContext, useState, useContext, useEffect } from 'react'
import auth from '../services/auth'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const currentUser = await auth.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }

  const login = async (email, password) => {
    const result = await auth.login(email, password)
    if (result.success) {
      setUser(result.user)
    }
    return result
  }

  const logout = async () => {
    await auth.logout()
    setUser(null)
    // NÃO REDIRECIONE AQUI - deixe o componente fazer isso
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}