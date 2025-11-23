import { API_URL } from '../assets/assets'
import { getAuthToken } from './authApi'

const getHeaders = () => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

// Create order
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating order:', error)
    return { success: false, message: 'Failed to create order' }
  }
}

// Get all orders
export const getUserOrders = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`${API_URL}/orders?page=${page}&limit=${limit}`, {
      headers: getHeaders()
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching orders:', error)
    return { success: false, orders: [] }
  }
}

// Get single order
export const getOrderById = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: getHeaders()
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching order:', error)
    return { success: false, message: 'Failed to fetch order' }
  }
}

// Cancel order
export const cancelOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: getHeaders()
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error cancelling order:', error)
    return { success: false, message: 'Failed to cancel order' }
  }
}