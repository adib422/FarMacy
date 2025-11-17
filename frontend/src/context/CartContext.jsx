import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (medicine) => {
    setCartItems(prev => {
      const exist = prev.find(item => item.id === medicine.id)
      if (exist) {
        return prev.map(item =>
          item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prev, { ...medicine, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (medicine, removeAll = false) => {
    setCartItems(prev => {
      const exist = prev.find(item => item.id === medicine.id)
      if (!exist) return prev
      
      if (removeAll || exist.quantity === 1) {
        return prev.filter(item => item.id !== medicine.id)
      } else {
        return prev.map(item =>
          item.id === medicine.id ? { ...item, quantity: item.quantity - 1 } : item
        )
      }
    })
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getItemQuantity = (id) => {
    const item = cartItems.find(item => item.id === id)
    return item ? item.quantity : 0
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,
      getItemQuantity,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  )
}



