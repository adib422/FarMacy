import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext'; // Add this
import LoginPopup from '../LoginPopup/LoginPopup'

const Navbar = () => {
    const [menu, setMenu] = useState("Home");
    const [showLogin, setShowLogin] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false); // Add this
    const { getTotalItems } = useCart();
    const { user, logout } = useUser(); // Add this
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      setShowDropdown(false);
      navigate('/');
    };

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className='navbar'>
          <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
          <ul className="navbar-menu">
              <Link to='/' onClick={()=>setMenu("Home")} className={menu==="Home"?"active":""}>Home</Link>
              <a href='#explore-categories' onClick={()=>setMenu("Categories")} className={menu==="Categories"?"active":""}>Categories</a>
              <a href='#app-download' onClick={()=>setMenu("Mobile App")} className={menu==="Mobile App"?"active":""}>Mobile App</a>
              <a href='#footer' onClick={()=>setMenu("About us")} className={menu==="About us"?"active":""}>About us</a>
          </ul>
          <div className="navbar-right">
            <Link to='/cart' className="navbar-cart-icon">
                <img src={assets.cart_icon} alt="" className="icon"/>
                {getTotalItems() > 0 && <div className="dot">{getTotalItems()}</div>}
            </Link>
            
            {user ? (
              <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user.name}</span>
                {showDropdown && (
                  <div className="user-dropdown">
                    <Link to='/dashboard' onClick={() => setShowDropdown(false)}>
                      <div className="dropdown-item">
                        👤 My Profile
                      </div>
                    </Link>
                    <Link to='/dashboard?tab=orders' onClick={() => setShowDropdown(false)}>
                      <div className="dropdown-item">
                        📦 My Orders
                      </div>
                    </Link>
                    <Link to='/dashboard?tab=addresses' onClick={() => setShowDropdown(false)}>
                      <div className="dropdown-item">
                        📍 My Addresses
                      </div>
                    </Link>
                    <div className="dropdown-item" onClick={handleLogout}>
                      🚪 Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)}>Sign in</button>
            )}
          </div> 
      </div>
    </>
  )
}

export default Navbar