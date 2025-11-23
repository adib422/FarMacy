require("dotenv").config();

const express = require('express');
const cors = require('cors');
const medicineRoutes = require('./routes/medicine');
const addressRoutes = require('./routes/address');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order'); 
const prescriptionRoutes = require('./routes/prescription'); 
const userRoutes = require('./routes/user');
const path = require('path');


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Serve static files for prescription uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/prescriptions', prescriptionRoutes); 
app.use('/api/user', userRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'FarMacy API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});