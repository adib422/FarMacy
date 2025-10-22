const express = require('express');
const cors = require('cors');
const medicineRoutes = require('./routes/medicine');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/medicines', medicineRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Medicine Store API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});