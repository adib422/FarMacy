import React, { useState, useEffect } from 'react';
import './PlaceOrder.css';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { cartItems, getTotalItems, clearCart } = useCart();
  const navigate = useNavigate();

  // Form states
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);

  // New address form
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.mrp * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  // Fetch saved addresses (you'll need to implement this API)
  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  const fetchSavedAddresses = async () => {
    try {
      // TODO: Replace with your actual API call
      // const response = await fetch('http://localhost:5000/api/addresses');
      // const data = await response.json();
      // setSavedAddresses(data.addresses);

      // For now, using dummy data
      const dummyAddresses = [
        {
          id: 1,
          firstName: 'Adib',
          lastName: 'Ali',
          phone: '+91 9876543210',
          street: '123 Main Street',
          city: 'New Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India'
        },
        {
          id: 2,
          firstName: 'Adib',
          lastName: 'Ali',
          phone: '+91 9876543210',
          street: '456 Park Avenue',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        }
      ];
      setSavedAddresses(dummyAddresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    const address = savedAddresses.find(addr => addr.id === addressId);
    if (address) {
      setFormData({
        firstName: address.firstName,
        lastName: address.lastName,
        email: address.email || '',
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setLoading(true);

    // Prepare order data
    const orderData = {
      items: cartItems,
      address: formData,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: 'COD' // You can add payment options later
    };

    try {
      // TODO: Send order to backend
      // const response = await fetch('http://localhost:5000/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // });
      // const data = await response.json();

      console.log('Order placed:', orderData);

      // Simulate API delay
      setTimeout(() => {
        alert('Order placed successfully! 🎉');
        clearCart();
        navigate('/');
        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className='place-order'>
        <div className="empty-order">
          <h2>No items in cart</h2>
          <p>Add medicines to your cart before placing an order</p>
          <button onClick={() => navigate('/')} className="go-home-btn">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        {/* Saved Addresses Section */}
        {savedAddresses.length > 0 && (
          <div className="saved-addresses-section">
            <div className="address-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={useExistingAddress}
                  onChange={(e) => {
                    setUseExistingAddress(e.target.checked);
                    if (!e.target.checked) {
                      setSelectedAddressId(null);
                      setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: 'India'
                      });
                    }
                  }}
                />
                Use saved address
              </label>
            </div>

            {useExistingAddress && (
              <div className="saved-addresses-list">
                {savedAddresses.map((address) => (
                  <div
                    key={address.id}
                    className={`address-card ${selectedAddressId === address.id ? 'selected' : ''}`}
                    onClick={() => handleAddressSelect(address.id)}
                  >
                    <input
                      type="radio"
                      name="savedAddress"
                      checked={selectedAddressId === address.id}
                      onChange={() => handleAddressSelect(address.id)}
                    />
                    <div className="address-details">
                      <p className="address-name">{address.firstName} {address.lastName}</p>
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} - {address.zipCode}</p>
                      <p className="address-phone">📞 {address.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Address Form */}
        <div className={`address-form ${useExistingAddress && selectedAddressId ? 'disabled' : ''}`}>
          <div className="multi-fields">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={useExistingAddress && selectedAddressId}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={useExistingAddress && selectedAddressId}
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={useExistingAddress && selectedAddressId}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={useExistingAddress && selectedAddressId}
          />
          <input
            type="text"
            name="street"
            placeholder="Street address"
            value={formData.street}
            onChange={handleChange}
            required
            disabled={useExistingAddress && selectedAddressId}
          />

          <div className="multi-fields">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={useExistingAddress && selectedAddressId}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
              disabled={useExistingAddress && selectedAddressId}
            />
          </div>

          <div className="multi-fields">
            <input
              type="text"
              name="zipCode"
              placeholder="Zip code"
              value={formData.zipCode}
              onChange={handleChange}
              required
              disabled={useExistingAddress && selectedAddressId}
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              required
              disabled={useExistingAddress && selectedAddressId}
            />
          </div>
        </div>
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal ({getTotalItems()} items)</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{total.toFixed(2)}</b>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Placing Order...' : 'PLACE ORDER'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;