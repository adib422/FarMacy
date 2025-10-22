const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all medicines with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [medicines] = await db.query(
      'SELECT * FROM medicines LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM medicines');

    res.json({
      success: true,
      data: medicines,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET medicines by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [medicines] = await db.query(
      'SELECT * FROM medicines WHERE category = ? ORDER BY popularity DESC LIMIT ? OFFSET ?',
      [category, limit, offset]
    );

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) as total FROM medicines WHERE category = ?',
      [category]
    );

    res.json({
      success: true,
      data: medicines,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET medicine by ID
router.get('/:id', async (req, res) => {
  try {
    const [medicine] = await db.query(
      'SELECT * FROM medicines WHERE id = ?',
      [req.params.id]
    );

    if (medicine.length === 0) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    res.json({ success: true, data: medicine[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// SEARCH medicines
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const searchTerm = `%${query}%`;

    const [medicines] = await db.query(
      `SELECT * FROM medicines 
       WHERE medicine_name LIKE ? OR brand LIKE ? OR composition LIKE ?
       LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, searchTerm, limit, offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM medicines 
       WHERE medicine_name LIKE ? OR brand LIKE ? OR composition LIKE ?`,
      [searchTerm, searchTerm, searchTerm]
    );

    res.json({
      success: true,
      data: medicines,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET top/featured medicines
router.get('/featured/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const [medicines] = await db.query(
      'SELECT * FROM medicines ORDER BY popularity DESC LIMIT ?',
      [limit]
    );

    res.json({ success: true, data: medicines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
