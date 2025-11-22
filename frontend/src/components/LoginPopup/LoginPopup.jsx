import React, { useState } from 'react';
import './LoginPopup.css';
import { signup, login } from '../../services/authApi';
import { useUser } from '../../context/UserContext';

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Login");
  const { login: loginUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (currState === "Sign Up") {
        // Validate signup
        if (!formData.name || !formData.email || !formData.password) {
          setError('Please fill all required fields');
          setLoading(false);
          return;
        }
        result = await signup(formData);
      } else {
        // Login
        if (!formData.email || !formData.password) {
          setError('Please enter email and password');
          setLoading(false);
          return;
        }
        result = await login({
          email: formData.email,
          password: formData.password
        });
      }

      if (result.success) {
        loginUser(result.user, result.token);
        setShowLogin(false);
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: ''
        });
      } else {
        setError(result.message || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className='login-popup'>
      <div className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <button 
            type="button"
            onClick={() => setShowLogin(false)} 
            className="close-btn"
          >
            ✕
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <>
              <input 
                type="text" 
                name="name"
                placeholder="Your name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
              <input 
                type="tel" 
                name="phone"
                placeholder="Phone number (optional)" 
                value={formData.phone}
                onChange={handleChange}
              />
            </>
          )}
          <input 
            type="email" 
            name="email"
            placeholder="Your email" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>

        <button 
          type="button"
          onClick={handleSubmit} 
          className="login-btn"
          disabled={loading}
        >
          {loading ? 'Please wait...' : (currState === "Sign Up" ? "Create account" : "Login")}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        {currState === "Login" ? (
          <p className="login-popup-switch">
            Create a new account? 
            <span onClick={() => {
              setCurrState("Sign Up");
              setError('');
            }}> Click here</span>
          </p>
        ) : (
          <p className="login-popup-switch">
            Already have an account? 
            <span onClick={() => {
              setCurrState("Login");
              setError('');
            }}> Login here</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;