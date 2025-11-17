import React, { useState } from 'react';
import './Cart.css';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.mrp * item.quantity);
  }, 0);

  // Delivery charges
  const deliveryFee = subtotal > 500 ? 0 : 40;

  // Calculate total
  const total = subtotal - discount + deliveryFee;

  // Apply promo code
  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    
    if (code === 'FARMACY10') {
      const discountAmount = subtotal * 0.1; // 10% off
      setDiscount(discountAmount);
      setPromoMessage('✓ 10% discount applied!');
    } else if (code === 'SAVE50') {
      setDiscount(50);
      setPromoMessage('✓ ₹50 discount applied!');
    } else if (code === 'FIRST100') {
      setDiscount(100);
      setPromoMessage('✓ ₹100 discount applied!');
    } else {
      setDiscount(0);
      setPromoMessage('✗ Invalid promo code');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/order');
  };

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <h3>Your cart is empty!</h3>
            <p>Add medicines to get started</p>
            <button onClick={() => navigate('/')} className="continue-shopping">
              Continue Shopping
            </button>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id}>
              <div className="cart-items-title cart-items-item">
                <p>{item.id}</p>
                <p>{item.medicine_name}</p>
                <p>₹{item.mrp}</p>
                <div className="cart-item-quantity">
                  <button onClick={() => removeFromCart(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item)}>+</button>
                </div>
                <p>₹{(item.mrp * item.quantity).toFixed(2)}</p>
                <button 
                  onClick={() => removeFromCart(item, true)} 
                  className="cart-remove-btn"
                >
                  ✕
                </button>
              </div>
              <hr />
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>₹{subtotal.toFixed(2)}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</p>
              </div>
              {deliveryFee > 0 && (
                <p className="free-delivery-info">
                  Add ₹{(500 - subtotal).toFixed(2)} more for FREE delivery
                </p>
              )}
              <hr />
              {discount > 0 && (
                <>
                  <div className="cart-total-details discount-applied">
                    <p>Discount</p>
                    <p>-₹{discount.toFixed(2)}</p>
                  </div>
                  <hr />
                </>
              )}
              <div className="cart-total-details">
                <b>Total</b>
                <b>₹{total.toFixed(2)}</b>
              </div>
            </div>
            <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
          </div>

          <div className="cart-promocode">
            <div>
              <p>If you have a promo code, enter it here</p>
              <div className="cart-promocode-input">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button onClick={applyPromoCode}>Apply</button>
              </div>
              {promoMessage && (
                <p className={`promo-message ${discount > 0 ? 'success' : 'error'}`}>
                  {promoMessage}
                </p>
              )}
              <div className="promo-codes-list">
                <p className="promo-title">Available Codes:</p>
                <p className="promo-item">• FARMACY10 - 10% off</p>
                <p className="promo-item">• SAVE50 - ₹50 off</p>
                <p className="promo-item">• FIRST100 - ₹100 off</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;