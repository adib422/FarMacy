import React, { useState, useEffect } from 'react';
import './MyOrders.css';
import { getUserOrders, cancelOrder, getOrderById } from '../../services/orderApi';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await getUserOrders(1, 20);
    if (result.success) {
      setOrders(result.orders);
    }
    setLoading(false);
  };

  const handleViewDetails = async (orderId) => {
    const result = await getOrderById(orderId);
    if (result.success) {
      setSelectedOrder(result.order);
      setShowDetails(true);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const result = await cancelOrder(orderId);
      if (result.success) {
        alert('Order cancelled successfully');
        fetchOrders();
        setShowDetails(false);
      } else {
        alert(result.message);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f39c12',
      confirmed: '#3498db',
      processing: '#9b59b6',
      shipped: '#1abc9c',
      delivered: '#27ae60',
      cancelled: '#e74c3c'
    };
    return colors[status] || '#7f8c8d';
  };

  if (loading) {
    return <div className='my-orders'><p>Loading orders...</p></div>;
  }

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <strong>Order #{order.id}</strong>
                  <span className="order-date">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <span 
                  className="order-status"
                  style={{ background: getStatusColor(order.status) }}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="order-info">
                <div className="info-item">
                  <span className="label">Items:</span>
                  <span>{order.item_count} item(s)</span>
                </div>
                <div className="info-item">
                  <span className="label">Total:</span>
                  <span className="order-total">₹{parseFloat(order.total).toFixed(2)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Payment:</span>
                  <span>{order.payment_method}</span>
                </div>
              </div>

              {order.first_name && (
                <div className="order-address">
                  <span>📍</span>
                  <p>{order.first_name} {order.last_name}, {order.city}, {order.state}</p>
                </div>
              )}

              <div className="order-actions">
                <button 
                  className="btn-view"
                  onClick={() => handleViewDetails(order.id)}
                >
                  View Details
                </button>
                {order.status === 'pending' && (
                  <button 
                    className="btn-cancel"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details</h3>
              <button className="close-btn" onClick={() => setShowDetails(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h4>Order Information</h4>
                <p><strong>Order ID:</strong> #{selectedOrder.id}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString('en-IN')}</p>
                <p>
                  <strong>Status:</strong> 
                  <span 
                    className="order-status"
                    style={{ background: getStatusColor(selectedOrder.status), marginLeft: '10px' }}
                  >
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </p>
              </div>

              <div className="detail-section">
                <h4>Delivery Address</h4>
                {selectedOrder.first_name ? (
                  <>
                    <p>{selectedOrder.first_name} {selectedOrder.last_name}</p>
                    <p>📞 {selectedOrder.phone}</p>
                    <p>{selectedOrder.street}</p>
                    <p>{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.zip_code}</p>
                    <p>{selectedOrder.country}</p>
                  </>
                ) : (
                  <p>Address not available</p>
                )}
              </div>

              <div className="detail-section">
                <h4>Order Items</h4>
                <div className="order-items-list">
                  {selectedOrder.items && selectedOrder.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="item-details">
                        <p className="item-name">{item.medicine_name}</p>
                        {item.brand && <p className="item-brand">{item.brand}</p>}
                        <p className="item-quantity">Qty: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        ₹{parseFloat(item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h4>Payment Summary</h4>
                <div className="payment-details">
                  <div className="payment-row">
                    <span>Subtotal:</span>
                    <span>₹{parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="payment-row">
                    <span>Delivery Fee:</span>
                    <span>{parseFloat(selectedOrder.delivery_fee) === 0 ? 'FREE' : `₹${parseFloat(selectedOrder.delivery_fee).toFixed(2)}`}</span>
                  </div>
                  {parseFloat(selectedOrder.discount) > 0 && (
                    <div className="payment-row discount">
                      <span>Discount:</span>
                      <span>-₹{parseFloat(selectedOrder.discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="payment-row total">
                    <strong>Total:</strong>
                    <strong>₹{parseFloat(selectedOrder.total).toFixed(2)}</strong>
                  </div>
                  <div className="payment-row">
                    <span>Payment Method:</span>
                    <span>{selectedOrder.payment_method}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.status === 'pending' && (
                <button 
                  className="btn-cancel-full"
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                >
                  Cancel This Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;