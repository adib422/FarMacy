const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware
router.use(authMiddleware);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/prescriptions');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpg, jpeg, png) and PDF files are allowed'));
    }
  }
});

// UPLOAD prescription
router.post('/upload', upload.single('prescription'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const [result] = await db.query(
      `INSERT INTO prescriptions 
       (user_id, order_id, file_name, file_path, file_size)
       VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        orderId || null,
        req.file.originalname,
        req.file.path,
        req.file.size
      ]
    );

    res.json({
      success: true,
      message: 'Prescription uploaded successfully',
      prescription: {
        id: result.insertId,
        fileName: req.file.originalname,
        fileSize: req.file.size
      }
    });
  } catch (error) {
    console.error('Error uploading prescription:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all prescriptions for logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;

    const [prescriptions] = await db.query(
      `SELECT p.*, o.id as order_number
       FROM prescriptions p
       LEFT JOIN orders o ON p.order_id = o.id
       WHERE p.user_id = ?
       ORDER BY p.uploaded_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      prescriptions
    });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE prescription
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    // Get prescription details
    const [prescriptions] = await db.query(
      'SELECT * FROM prescriptions WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (prescriptions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(prescriptions[0].file_path)) {
      fs.unlinkSync(prescriptions[0].file_path);
    }

    // Delete from database
    await db.query(
      'DELETE FROM prescriptions WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Prescription deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DOWNLOAD/VIEW prescription
router.get('/:id/download', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const [prescriptions] = await db.query(
      'SELECT * FROM prescriptions WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (prescriptions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    const filePath = prescriptions[0].file_path;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.download(filePath, prescriptions[0].file_name);
  } catch (error) {
    console.error('Error downloading prescription:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;