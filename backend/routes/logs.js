// logs.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load logs data
const getLogs = () => {
  const data = fs.readFileSync(path.join(__dirname, '../data/logs.json'), 'utf-8');
  return JSON.parse(data);
};

// GET all logs with filtering
router.get('/', (req, res) => {
  try {
    let logs = getLogs();
    const { severity, device, search, limit } = req.query;
    
    // Filter by severity
    if (severity) {
      logs = logs.filter(log => log.severity === severity);
    }
    
    // Filter by device
    if (device) {
      logs = logs.filter(log => log.device === device);
    }
    
    // Search in message
    if (search) {
      logs = logs.filter(log => 
        log.message.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Limit results
    if (limit) {
      logs = logs.slice(0, parseInt(limit));
    }
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// POST add new log
router.post('/', (req, res) => {
  try {
    const logs = getLogs();
    const newLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...req.body
    };
    
    logs.unshift(newLog);
    
    fs.writeFileSync(
      path.join(__dirname, '../data/logs.json'),
      JSON.stringify(logs, null, 2)
    );
    
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add log' });
  }
});

module.exports = router;