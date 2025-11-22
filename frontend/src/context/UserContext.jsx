import React, { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser, logout as logoutApi } from '../services/authApi'

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      // Verify token is still valid
      verifyUser()
    } else {
      setLoading(false)
    }
  }, [])

  const verifyUser = async () => {
    const result = await getCurrentUser()
    if (result.success) {
      setUser(result.user)
    } else {
      // Token invalid, clear everything
      logout()
    }
    setLoading(false)
  }

  const login = (userData, token) => {
    setUser(userData)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    logoutApi()
  }

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      updateUser,
      isAuthenticated: !!user
    }}>
      {children}
    </UserContext.Provider>
  )
}