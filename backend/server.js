// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const devicesRouter = require('./routes/devices');
const analyticsRouter = require('./routes/analytics');
const liveRouter = require('./routes/live');
const logsRouter = require('./routes/logs');

// Use routes
app.use('/api/devices', devicesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/live', liveRouter);
app.use('/api/logs', logsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});