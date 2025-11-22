import { API_URL } from '../assets/assets'
import { getAuthToken } from './authApi'

// Helper function to get headers with token
const getHeaders = () => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

// Get all addresses for logged-in user
export const getUserAddresses = async () => {
  try {
    const response = await fetch(`${API_URL}/addresses`, {
      headers: getHeaders()
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return { success: false, addresses: [] }
  }
}

// Save new address
export const saveAddress = async (addressData) => {
  try {
    const response = await fetch(`${API_URL}/addresses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(addressData)
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error saving address:', error)
    return { success: false, message: 'Failed to save address' }
  }
}

// Update address
export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await fetch(`${API_URL}/addresses/${addressId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(addressData)
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating address:', error)
    return { success: false, message: 'Failed to update address' }
  }
}

// Delete address
export const deleteAddress = async (addressId) => {
  try {
    const response = await fetch(`${API_URL}/addresses/${addressId}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error deleting address:', error)
    return { success: false, message: 'Failed to delete address' }
  }
}