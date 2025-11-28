// devices.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load devices data
const getDevices = () => {
  const data = fs.readFileSync(path.join(__dirname, '../data/devices.json'), 'utf-8');
  return JSON.parse(data);
};

// GET all devices
router.get('/', (req, res) => {
  try {
    const devices = getDevices();
    const { status } = req.query;
    
    if (status) {
      const filtered = devices.filter(d => d.status === status);
      return res.json(filtered);
    }
    
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// GET single device by ID
router.get('/:id', (req, res) => {
  try {
    const devices = getDevices();
    const device = devices.find(d => d.id === req.params.id);
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch device' });
  }
});

// POST update device status
router.post('/:id/status', (req, res) => {
  try {
    const devices = getDevices();
    const deviceIndex = devices.findIndex(d => d.id === req.params.id);
    
    if (deviceIndex === -1) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    const { status } = req.body;
    devices[deviceIndex].status = status;
    devices[deviceIndex].lastActive = new Date().toISOString();
    
    fs.writeFileSync(
      path.join(__dirname, '../data/devices.json'),
      JSON.stringify(devices, null, 2)
    );
    
    res.json(devices[deviceIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update device' });
  }
});

module.exports = router;