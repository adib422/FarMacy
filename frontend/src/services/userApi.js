import { API_URL } from '../assets/assets'
import { getAuthToken } from './authApi'

const getHeaders = () => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      headers: getHeaders()
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching profile:', error)
    return { success: false, message: 'Failed to fetch profile' }
  }
}

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating profile:', error)
    return { success: false, message: 'Failed to update profile' }
  }
}

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await fetch(`${API_URL}/user/change-password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(passwordData)
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error changing password:', error)
    return { success: false, message: 'Failed to change password' }
  }
}