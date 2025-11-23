import React, { useState, useEffect } from 'react';
import './MyAddresses.css';
import { getUserAddresses, saveAddress, updateAddress, deleteAddress } from '../../services/addressApi';

const MyAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    const result = await getUserAddresses();
    if (result.success) {
      setAddresses(result.addresses);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const result = editingId 
      ? await updateAddress(editingId, formData)
      : await saveAddress(formData);

    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: editingId ? 'Address updated successfully!' : 'Address added successfully!' 
      });
      fetchAddresses();
      resetForm();
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const handleEdit = (address) => {
    setFormData({
      firstName: address.first_name,
      lastName: address.last_name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zip_code,
      country: address.country,
      isDefault: address.is_default === 1
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const result = await deleteAddress(id);
      if (result.success) {
        setMessage({ type: 'success', text: 'Address deleted successfully!' });
        fetchAddresses();
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: false
    });
    setShowForm(false);
    setEditingId(null);
  };

  if (loading) {
    return <div className='my-addresses'><p>Loading addresses...</p></div>;
  }

  return (
    <div className='my-addresses'>
      <div className="addresses-header">
        <h2>My Addresses</h2>
        <button 
          className="add-address-btn"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add New Address'}
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="address-form-container">
          <h3>{editingId ? 'Edit Address' : 'Add New Address'}</h3>
          <form onSubmit={handleSubmit} className="address-form">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <label className="default-checkbox">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />
              Set as default address
            </label>
            
            <button type="submit" className="save-btn">
              {editingId ? 'Update Address' : 'Save Address'}
            </button>
          </form>
        </div>
      )}

      <div className="addresses-list">
        {addresses.length === 0 ? (
          <div className="no-addresses">
            <p>No saved addresses yet</p>
            <button onClick={() => setShowForm(true)} className="add-first-btn">
              Add your first address
            </button>
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="address-card">
              {address.is_default === 1 && <span className="default-badge">Default</span>}
              <div className="address-info">
                <h4>{address.first_name} {address.last_name}</h4>
                <p>📞 {address.phone}</p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} - {address.zip_code}</p>
                <p>{address.country}</p>
              </div>
              <div className="address-actions">
                <button onClick={() => handleEdit(address)} className="address-edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(address.id)} className="address-delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAddresses;