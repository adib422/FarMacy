import { API_URL } from '../assets/assets'
import { getAuthToken } from './authApi'

const getAuthHeaders = () => {
  const token = getAuthToken()
  return {
    'Authorization': `Bearer ${token}`
  }
}

// Upload prescription
export const uploadPrescription = async (file, orderId = null) => {
  try {
    const formData = new FormData()
    formData.append('prescription', file)
    if (orderId) {
      formData.append('orderId', orderId)
    }

    const response = await fetch(`${API_URL}/prescriptions/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error uploading prescription:', error)
    return { success: false, message: 'Failed to upload prescription' }
  }
}

// Get all prescriptions
export const getUserPrescriptions = async () => {
  try {
    const response = await fetch(`${API_URL}/prescriptions`, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching prescriptions:', error)
    return { success: false, prescriptions: [] }
  }
}

// Delete prescription
export const deletePrescription = async (prescriptionId) => {
  try {
    const response = await fetch(`${API_URL}/prescriptions/${prescriptionId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error deleting prescription:', error)
    return { success: false, message: 'Failed to delete prescription' }
  }
}

// Download prescription
export const downloadPrescription = (prescriptionId) => {
  const token = getAuthToken()
  window.open(`${API_URL}/prescriptions/${prescriptionId}/download?token=${token}`, '_blank')
}