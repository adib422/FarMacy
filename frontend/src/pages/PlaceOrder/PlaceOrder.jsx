import React, { useState, useEffect } from 'react';
import './PlaceOrder.css';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { getUserAddresses } from '../../services/addressApi';
import { createOrder } from '../../services/orderApi';

const PlaceOrder = () => {
  const { cartItems, getTotalItems, clearCart } = useCart();
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();

  // Form states
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(false);

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

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      alert('Please login to place an order');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Fetch saved addresses
  useEffect(() => {
    if (isAuthenticated) {
      fetchSavedAddresses();
    }
  }, [isAuthenticated]);

  const fetchSavedAddresses = async () => {
    try {
      const result = await getUserAddresses();
      if (result.success) {
        const formattedAddresses = result.addresses.map(addr => ({
          id: addr.id,
          firstName: addr.first_name,
          lastName: addr.last_name,
          phone: addr.phone,
          street: addr.street,
          city: addr.city,
          state: addr.state,
          zipCode: addr.zip_code,
          country: addr.country,
          isDefault: addr.is_default
        }));
        setSavedAddresses(formattedAddresses);

        // Auto-select default address
        const defaultAddr = formattedAddresses.find(addr => addr.isDefault === 1);
        if (defaultAddr) {
          setUseExistingAddress(true);
          handleAddressSelect(defaultAddr.id);
        }
      }
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
        email: user?.email || '',
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

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.zipCode) {
      alert('Please fill all address fields');
      return;
    }

    setLoading(true);

    // Prepare order data
    const orderData = {
      items: cartItems,
      addressId: selectedAddressId || null,
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      paymentMethod: 'COD'
    };

    try {
      const result = await createOrder(orderData);

      if (result.success) {
        alert('Order placed successfully! 🎉\nOrder ID: #' + result.orderId);
        clearCart();
        navigate('/dashboard?tab=orders');
      } else {
        alert(result.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }

    setLoading(false);
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
                        email: user?.email || '',
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

            <div className="add-new-address-link">
              <button 
                type="button"
                onClick={() => navigate('/dashboard?tab=addresses')}
                className="manage-addresses-btn"
              >
                + Add New Address
              </button>
            </div>
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
            value={formData.email || user?.email}
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
            {deliveryFee > 0 && subtotal < 500 && (
              <p className="free-delivery-info">
                Add ₹{(500 - subtotal).toFixed(2)} more for FREE delivery
              </p>
            )}
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{total.toFixed(2)}</b>
            </div>
          </div>

          <div className="order-summary">
            <h3>Order Items:</h3>
            <div className="order-items-preview">
              {cartItems.slice(0, 3).map((item) => (
                <div key={item.id} className="order-item-preview">
                  <span>{item.medicine_name}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
              {cartItems.length > 3 && (
                <p className="more-items">+{cartItems.length - 3} more items</p>
              )}
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Placing Order...' : 'PLACE ORDER'}
          </button>

          <div className="payment-info">
            <p>💵 Payment Method: Cash on Delivery (COD)</p>
            <p>📦 Delivery in 30-45 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;