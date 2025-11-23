import React from 'react'
import Navbar from './components/Navbar/Navbar'

import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import { CartProvider } from './context/CartContext'
import { UserProvider } from './context/UserContext'
import Footer from './components/Footer/Footer'
import UserDashboard from './pages/UserDashboard/UserDashboard'


const App = () => {
  return (
    <UserProvider> 
      <CartProvider>
        <div className='App'>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<PlaceOrder />} />
            <Route path='/dashboard' element={<UserDashboard />} />
          </Routes>
          <Footer />
        </div>
      </CartProvider>
    </UserProvider>
  )
}

export default App
