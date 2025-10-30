// server.js
const express = require('express');
const app = express();

// =======================
// 1️⃣ Logging Middleware
// =======================
const loggerMiddleware = (req, res, next) => {
  const currentTime = new Date().toLocaleString();
  console.log(`[${currentTime}] ${req.method} ${req.url}`);
  next(); // continue to the next middleware or route handler
};

// Apply logging middleware globally
app.use(loggerMiddleware);

// =======================
// 2️⃣ Authentication Middleware
// =======================
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1]; // Extract token after 'Bearer'

  if (token !== 'mysecrettoken') {
    return res.status(403).json({ error: 'Invalid or missing Bearer token' });
  }

  // If token is valid
  next();
};

// =======================
// 3️⃣ Routes
// =======================

// Public Route (no authentication required)
app.get('/public', (req, res) => {
  res.json({ message: 'Welcome to the public route! 🚀' });
});

// Protected Route (authentication required)
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Access granted! You reached the protected route 🔐' });
});

// =======================
// 4️⃣ Start the server
// =======================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
