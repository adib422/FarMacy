const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// CREATE Order
router.post('/', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const userId = req.user.userId;
    const {
      items,
      addressId,
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod
    } = req.body;

    // Validate
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }

    // Insert order
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
       (user_id, address_id, subtotal, delivery_fee, discount, total, payment_method, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [userId, addressId, subtotal, deliveryFee || 0, discount || 0, total, paymentMethod || 'COD']
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items 
         (order_id, medicine_id, medicine_name, brand, quantity, price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.id, item.medicine_name, item.brand, item.quantity, item.mrp]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Order placed successfully',
      orderId: orderId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
});

// GET all orders for logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [orders] = await db.query(
      `SELECT o.*, 
              a.first_name, a.last_name, a.street, a.city, a.state, a.zip_code,
              COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single order details
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    // Get order
    const [orders] = await db.query(
      `SELECT o.*, 
              a.first_name, a.last_name, a.phone, a.street, a.city, a.state, a.zip_code, a.country
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.id = ? AND o.user_id = ?`,
      [id, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get order items
    const [items] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    res.json({
      success: true,
      order: {
        ...orders[0],
        items
      }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// CANCEL order (only if pending)
router.put('/:id/cancel', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    // Check if order exists and belongs to user
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (orders[0].status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order. Order is already being processed.'
      });
    }

    await db.query(
      'UPDATE orders SET status = "cancelled" WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;