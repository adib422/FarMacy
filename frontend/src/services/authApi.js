import { API_URL } from '../assets/assets'

// Signup
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    const data = await response.json()
    
    if (data.success) {
      // Save token to localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    
    return data
  } catch (error) {
    console.error('Signup error:', error)
    return { success: false, message: 'Failed to signup' }
  }
}

// Login
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    const data = await response.json()
    
    if (data.success) {
      // Save token to localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    
    return data
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, message: 'Failed to login' }
  }
}

// Get current user
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return { success: false, message: 'No token found' }
    }
    
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json()
    
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    
    return data
  } catch (error) {
    console.error('Get user error:', error)
    return { success: false, message: 'Failed to get user' }
  }
}

// Logout
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// Get token for API requests
export const getAuthToken = () => {
  return localStorage.getItem('token')
}

// Check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}