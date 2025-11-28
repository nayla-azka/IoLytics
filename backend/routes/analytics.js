// analytics.js

const express = require('express');
const router = express.Router();

// Generate mock analytics data for real IoT devices
const generateAnalytics = () => {
  const days = 7;
  const temperatureData = [];
  const humidityData = [];
  const rfidScansData = [];
  const energyConsumptionData = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Weather sensor data (Temperature only)
    temperatureData.push({
      date: dateStr,
      value: (26 + Math.random() * 6).toFixed(1),
      min: (24 + Math.random() * 2).toFixed(1),
      max: (30 + Math.random() * 3).toFixed(1)
    });

    // Plant humidity data (Smart Watering has humidity)
    humidityData.push({
      date: dateStr,
      value: (60 + Math.random() * 15).toFixed(0),
      min: (55 + Math.random() * 5).toFixed(0),
      max: (70 + Math.random() * 10).toFixed(0)
    });

    // RFID reader activity
    rfidScansData.push({
      date: dateStr,
      mainEntrance: Math.floor(120 + Math.random() * 80),
      officeFloor: Math.floor(70 + Math.random() * 50)
    });

    // Energy consumption (smart outlets + lights)
    energyConsumptionData.push({
      date: dateStr,
      lights: (15 + Math.random() * 5).toFixed(1),
      outlets: (30 + Math.random() * 15).toFixed(1),
      total: (45 + Math.random() * 20).toFixed(1)
    });
  }

  return {
    temperature: temperatureData,
    humidity: humidityData,
    rfidScans: rfidScansData,
    energyConsumption: energyConsumptionData,
    summary: {
      avgTemperature: '28.5',
      totalDevices: 12,
      onlineDevices: 11,
      offlineDevices: 1,
      totalRFIDScansToday: 236,
      totalEnergyToday: '65.8',
      plantHealthScore: 85,
      weatherCondition: 'Sunny'
    }
  };
};

// GET analytics data
router.get('/', (req, res) => {
  try {
    const analytics = generateAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET device type distribution
router.get('/device-types', (req, res) => {
  try {
    const distribution = [
      { type: 'RFID Readers', count: 2, percentage: 17 },
      { type: 'Smart Lights', count: 2, percentage: 17 },
      { type: 'Smart Outlets', count: 2, percentage: 17 },
      { type: 'Plant Monitors', count: 2, percentage: 17 },
      { type: 'Weather Sensors', count: 2, percentage: 17 },
      { type: 'Weight Scales', count: 2, percentage: 15 }
    ];
    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch device types' });
  }
});

// GET RFID access statistics
router.get('/rfid-stats', (req, res) => {
  try {
    const stats = {
      todayScans: 236,
      uniqueCards: 47,
      peakHour: '09:00',
      avgResponseTime: '0.3s',
      accessDenied: 2
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch RFID stats' });
  }
});

// GET energy consumption stats
router.get('/energy-stats', (req, res) => {
  try {
    const stats = {
      totalToday: '65.8 kWh',
      lights: '22.4 kWh',
      outlets: '43.4 kWh',
      estimatedCost: 'Rp 98,700',
      comparedToYesterday: '-8%'
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch energy stats' });
  }
});

module.exports = router;