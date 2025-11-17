import React from 'react'
import Navbar from './components/Navbar/Navbar'

import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import { CartProvider } from './context/CartContext' // Import your context provider
import Footer from './components/Footer/Footer'


const App = () => {
  return (
    <CartProvider>
      <div className='App'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
        </Routes>
        <Footer />
      </div>
    </CartProvider>
  )
}

export default App
