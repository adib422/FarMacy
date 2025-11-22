const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth'); 

// Apply auth middleware to all routes
router.use(authMiddleware); 

// GET all addresses for logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId; // Get from token

    const [addresses] = await db.query(
      `SELECT * FROM addresses 
       WHERE user_id = ? 
       ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      addresses: addresses
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Add new address
router.post('/', async (req, res) => {
  try {
    const userId = req.user.userId; // Get from token
    const {
      firstName,
      lastName,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault
    } = req.body;

    // If this is set as default, unset all other defaults for this user
    if (isDefault) {
      await db.query(
        'UPDATE addresses SET is_default = FALSE WHERE user_id = ?',
        [userId]
      );
    }

    const [result] = await db.query(
      `INSERT INTO addresses 
       (user_id, first_name, last_name, phone, street, city, state, zip_code, country, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, firstName, lastName, phone, street, city, state, zipCode, country || 'India', isDefault || false]
    );

    const [newAddress] = await db.query(
      'SELECT * FROM addresses WHERE id = ?',
      [result.insertId]
    );

    res.json({
      success: true,
      message: 'Address saved successfully',
      address: newAddress[0]
    });
  } catch (error) {
    console.error('Error saving address:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Update address
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const {
      firstName,
      lastName,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault
    } = req.body;

    // Verify address belongs to user
    const [existing] = await db.query(
      'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    if (isDefault) {
      await db.query(
        'UPDATE addresses SET is_default = FALSE WHERE user_id = ? AND id != ?',
        [userId, id]
      );
    }

    await db.query(
      `UPDATE addresses 
       SET first_name = ?, last_name = ?, phone = ?, street = ?, 
           city = ?, state = ?, zip_code = ?, country = ?, is_default = ?
       WHERE id = ? AND user_id = ?`,
      [firstName, lastName, phone, street, city, state, zipCode, country, isDefault, id, userId]
    );

    const [updatedAddress] = await db.query(
      'SELECT * FROM addresses WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Address updated successfully',
      address: updatedAddress[0]
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE - Delete address
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await db.query(
      'DELETE FROM addresses WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;