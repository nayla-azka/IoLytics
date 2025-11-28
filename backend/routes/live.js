// live.js

const express = require('express');
const router = express.Router();

// Simulate real-time sensor readings for actual IoT devices
router.get('/', (req, res) => {
  const liveData = {
    // Weather sensors
    temperature: (26 + Math.random() * 6).toFixed(1),
    // humidity: (60 + Math.random() * 15).toFixed(0), // Removed as per requirement
    // pressure: (1010 + Math.random() * 8).toFixed(2), // Removed
    // windSpeed: (5 + Math.random() * 15).toFixed(1), // Removed
    // uvIndex: Math.floor(4 + Math.random() * 5), // Removed

    // RFID readers
    recentScans: Math.floor(5 + Math.random() * 10),
    activeCards: Math.floor(40 + Math.random() * 15),

    // Smart lights & outlets
    totalPowerConsumption: (40 + Math.random() * 30).toFixed(1),
    lightsOn: Math.floor(1 + Math.random() * 2),
    outletsOn: Math.floor(1 + Math.random() * 2),

    // Plant monitoring
    avgSoilMoisture: (35 + Math.random() * 20).toFixed(0), // Keep for summary? Or remove?
    plantsNeedWater: Math.random() > 0.7 ? 1 : 0,

    // Weight scales
    activeScales: Math.random() > 0.3 ? 1 : 0,

    updatedAt: new Date().toISOString()
  };

  res.json(liveData);
});

// Get live data for specific device type
router.get('/type/:deviceType', (req, res) => {
  const { deviceType } = req.params;
  let liveData = { deviceType, updatedAt: new Date().toISOString() };

  switch (deviceType) {
    case 'rfid_reader':
      liveData = {
        ...liveData,
        fullName: ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Wilson'][Math.floor(Math.random() * 4)],
        macAddress: `00:1B:44:11:${Math.floor(Math.random() * 99)}:${Math.floor(Math.random() * 99)}`,
        time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        date: new Date().toISOString().split('T')[0],
        school: ['Engineering', 'Business', 'Arts', 'Science'][Math.floor(Math.random() * 4)],
        id: `ID-${Math.floor(1000 + Math.random() * 9000)}`
      };
      break;

    case 'smart_light':
      liveData = {
        ...liveData,
        bulbStatus: Math.random() > 0.3 ? 'On' : 'Off',
        voltage: 220,
        current: (0.05 + Math.random() * 0.05).toFixed(2),
        power: (10 + Math.random() * 10).toFixed(1),
        energy: (10 + Math.random() * 5).toFixed(1),
        frequency: 50
      };
      break;

    case 'smart_outlet':
      liveData = {
        ...liveData,
        outletStatus: Math.random() > 0.3 ? 'On' : 'Off',
        voltage: 220,
        current: (1 + Math.random() * 5).toFixed(2),
        power: (200 + Math.random() * 1000).toFixed(0),
        energy: (1 + Math.random() * 5).toFixed(2),
        frequency: 50
      };
      break;

    case 'plant_watering':
      liveData = {
        ...liveData,
        datetime: new Date().toISOString(),
        waterpumpStatus: Math.random() > 0.8 ? 'On' : 'Off',
        soilMoistureStatus: Math.random() > 0.5 ? 'Moist' : 'Dry',
        humidity: (55 + Math.random() * 15).toFixed(0)
      };
      break;

    case 'weather_sensor':
      liveData = {
        ...liveData,
        datetime: new Date().toISOString(),
        weather: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
        temperature: (26 + Math.random() * 6).toFixed(1)
      };
      break;

    case 'weight_scale':
      liveData = {
        ...liveData,
        datetime: new Date().toISOString(),
        measurement: (Math.random() * 100).toFixed(2)
      };
      break;

    default:
      return res.status(404).json({ error: 'Device type not found' });
  }

  res.json(liveData);
});

// Get live data for specific device
router.get('/:deviceId', (req, res) => {
  const { deviceId } = req.params;

  const liveData = {
    deviceId,
    datetime: new Date().toISOString(),
    status: 'online'
  };

  res.json(liveData);
});

module.exports = router;