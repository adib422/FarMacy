const mysql = require('mysql2');

// Create connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',              // Change to your MySQL username
  password: 'adib@123',  // Change to your MySQL password
  database: 'medicine_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get promise-based connection
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('✓ Connected to MySQL database');
  connection.release();
});

module.exports = promisePool;