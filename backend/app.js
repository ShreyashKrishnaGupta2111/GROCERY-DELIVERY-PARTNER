const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');
const locationRoutes = require('./routes/locationRoutes');
const errorHandler = require('./middleware/errorHandler');
const { GOOGLE_MAPS_API_KEY, defaultCenter, deliveryRadiusKm } = require('./config/googleConfig');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory orders store
const orders = [];

// Serve original API config endpoint
app.get('/api/config', (req, res) => {
  res.status(200).json({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || '',
    defaultCenter,
    deliveryRadiusKm
  });
});

// Serve original Orders endpoints
app.post('/api/orders', (req, res) => {
  const { items, total, address } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must include at least one item' });
  }

  const savedOrder = {
    id: randomUUID(),
    items,
    total: Number(total || 0),
    address: String(address || ''),
    createdAt: new Date().toISOString(),
    status: 'accepted',
    etaMinutes: 10
  };

  orders.push(savedOrder);
  res.status(201).json(savedOrder);
});

app.get('/api/orders', (req, res) => {
  res.status(200).json({ orders });
});

// Location Finder endpoints
app.use('/api', locationRoutes);
app.use('/api/payment', require('./routes/paymentRoutes'));


// 404 Route handler
app.use((req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
