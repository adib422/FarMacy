import React from 'react'
import './Header.css'
import { assets } from '../../assets/assets'

const Header = () => {
  return (
    <div className='header'>
        <img src="/header_image.jpeg" alt="Banner" className="header-image" />
        <div className="header-contents">
            <h2>Order your medicines here</h2>
            <p>Choose from all kinds of medicines according to your needs</p>
            <div className="search-bar">
            <i className="search-icon"></i>
            <input
                type="text"
                placeholder="Search medicines..."
                className="search-input"
            />
            <button className="search-btn">
                <img src={assets.search_icon} className="icon" alt="Search" />
            </button>
        </div>
        </div>
        

    </div>
  )
}

export default Header