import React, { useState, useEffect } from 'react';
import './UserDashboard.css';
import { useUser } from '../../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import MyProfile from './MyProfile';
import MyAddresses from './MyAddresses';
import MyOrders from './MyOrders';
import MyPrescriptions from './MyPrescriptions';

const UserDashboard = () => {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get tab from URL query params
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab') || 'profile';
  
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard?tab=${tab}`);
  };

  if (!user) {
    return <div className='user-dashboard'><p>Loading...</p></div>;
  }

  return (
    <div className='user-dashboard'>
      <div className="dashboard-header">
        <h1>My Account</h1>
        <p>Welcome back, {user.name}!</p>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <div
            className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            <span className="icon">👤</span>
            <span>My Profile</span>
          </div>
          <div
            className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => handleTabChange('orders')}
          >
            <span className="icon">📦</span>
            <span>My Orders</span>
          </div>
          <div
            className={`sidebar-item ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => handleTabChange('addresses')}
          >
            <span className="icon">📍</span>
            <span>My Addresses</span>
          </div>
          <div
            className={`sidebar-item ${activeTab === 'prescriptions' ? 'active' : ''}`}
            onClick={() => handleTabChange('prescriptions')}
          >
            <span className="icon">📄</span>
            <span>Prescriptions</span>
          </div>
        </div>

        <div className="dashboard-content">
          {activeTab === 'profile' && <MyProfile />}
          {activeTab === 'orders' && <MyOrders />}
          {activeTab === 'addresses' && <MyAddresses />}
          {activeTab === 'prescriptions' && <MyPrescriptions />}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;