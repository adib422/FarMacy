import { API_URL } from '../assets/assets'

// Get all medicines with pagination
export const getAllMedicines = async (page = 1, limit = 20) => {
  try {
    const response = await fetch(`${API_URL}/medicines?page=${page}&limit=${limit}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching medicines:', error)
    return { success: false, data: [] }
  }
}

// Get medicines by category
export const getMedicinesByCategory = async (category, page = 1, limit = 20) => {
  try {
    const url = `${API_URL}/medicines/category/${category}?page=${page}&limit=${limit}`
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching medicines by category:', error)
    return { success: false, data: [] }
  }
}

// Get medicine by ID
export const getMedicineById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/medicines/${id}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching medicine:', error)
    return { success: false, data: null }
  }
}

// Search medicines
export const searchMedicines = async (query, page = 1, limit = 20) => {
  try {
    const response = await fetch(`${API_URL}/medicines/search/${query}?page=${page}&limit=${limit}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error searching medicines:', error)
    return { success: false, data: [] }
  }
}

// Get top/featured medicines
export const getTopMedicines = async (limit = 8) => {
  try {
    const response = await fetch(`${API_URL}/medicines/featured/top?limit=${limit}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching top medicines:', error)
    return { success: false, data: [] }
  }
}