import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className="footer" id='footer'>
      <div className="footer-content">
        <div className="footer-section">
          <h3>FarMacy</h3>
          <p>Your trusted partner for quick and reliable medicine delivery. Quality healthcare at your doorstep.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a href="#" aria-label="Twitter">
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
            <a href="#" aria-label="Instagram">
              <img src={assets.instagram_icon} alt="Instagram" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#explore-categories">Categories</a></li>
            <li><a href="/cart">My Cart</a></li>
            <li><a href="#about">About Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#shipping">Shipping Info</a></li>
            <li><a href="#returns">Return Policy</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
            <li><a href="#disclaimer">Medical Disclaimer</a></li>
            <li><a href="#license">Pharmacy License</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <ul className="contact-info">
            <li>📞 +91 1800-123-4567</li>
            <li>📧 support@farmacy.com</li>
            <li>📍 Delhi, India</li>
            <li>🕐 24/7 Support</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 FarMacy. All rights reserved.</p>
        <p className="disclaimer">Always consult a healthcare professional before taking any medication.</p>
      </div>
    </footer>
  );
};

export default Footer;