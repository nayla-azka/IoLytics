# IoLytics - IoT Device Monitoring Dashboard

IoLytics adalah platform monitoring dan analytics IoT yang komprehensif — menyediakan kemampuan real-time monitoring, analytics, dan device management untuk berbagai perangkat IoT seperti RFID readers, smart lights, smart outlets, plant monitoring systems, weather sensors, dan weight scales.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Frontend Documentation](#frontend-documentation)
- [Development Guide](#development-guide)
- [Deployment](#deployment)

## 🎯 Overview

IoLytics adalah solusi full-stack untuk monitoring IoT yang memungkinkan pengguna untuk:

- Memantau banyak IoT devices secara real-time
- Melihat analytics dan trends
- Memantau status dan health device
- Melihat activity logs
- Menganalisis konsumsi energi
- Monitoring kondisi lingkungan

Platform ini terdiri dari frontend React dashboard dan backend Node.js / Express yang menyediakan data devices, analytics, dan sensor readings secara berkala.

## ✨ Features

### Dashboard
- **Real-time Monitoring**: live sensor readings diperbarui setiap 3 detik
- **Device Status Overview**: informasi device online/offline
- **Environmental Metrics**: Ttemperature, kondisi cuaca, dll.
- **Energy Monitoring**: tracking konsumsi daya real-time
- **Activity Logs**: event device terbaru dan notifikasi
- **Interactive Charts**: tren 7-hari untuk temperature, RFID activity, energy consumption

### Device Management
- **Device List**: lihat semua device terdaftar
- **Device Details**: informasi dan readings per device
- **Status Control**: update device status (online/offline)
- **Device Filtering**: filter berdasarkan status atau device type
- **Device Types Supported**:
  - RFID Readers
  - Smart Lights
  - Smart Outlets
  - Plant Watering Systems
  - Weather Sensors
  - Weight Scales

### Analytics
- **Temperature Trends**: data temperature 7-hari dengan data min/max
- **Humidity Analysis**: pola kelembapan harian
- **RFID Access Statistics**: pola akses per lokasi
- **Energy Consumption**: breakdown per device type
- **Soil Moisture Tracking**: monitoring kelembapan tanaman
- **Device Type Distribution**: representasi inventory device

### Logs
- **Activity Logging**: sistem logging event komprehensif
- **Severity Levels**: info, warning, error
- **Filtering**: filter berdasarkan severity, device, search terms
- **Real-time Updates**: tampilkan event terbaru di atas

### Settings
- **System Configuration**: pengaturan platform dan preference
- **Notification Management**: toggle notifikasi global dan test notifikasi

## 🛠 Tech Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing
- **File System**: JSON-based data storage

### Frontend
- **React 18**: UI library
- **React Router DOM**: Client-side routing
- **Vite**: Build tool and dev server
- **Axios**: HTTP client
- **Recharts**: Data visualization library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Development Tools
- **Nodemon**: Auto-restart for backend development
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📁 Project Structure

```
IoLytics/
├── backend/
│   ├── data/
│   │   ├── devices.json      # Device registry data
│   │   └── logs.json         # Activity logs data
│   ├── routes/
│   │   ├── devices.js        # Device management endpoints
│   │   ├── analytics.js     # Analytics data endpoints
│   │   ├── live.js          # Real-time sensor data endpoints
│   │   └── logs.js          # Log management endpoints
│   ├── server.js            # Express server entry point
│   ├── package.json         # Backend dependencies
│   └── package-lock.json
│
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   └── Toast.jsx     # Toast notification component
│   │   ├── context/
│   │   │   └── NotificationContext.jsx  # Notification state management
│   │   ├── layouts/
│   │   │   └── Layout.jsx   # Main application layout
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Main dashboard page
│   │   │   ├── Devices.jsx      # Device management page
│   │   │   ├── Analytics.jsx   # Analytics page
│   │   │   ├── Logs.jsx        # Logs viewer page
│   │   │   └── Settings.jsx    # Settings page
│   │   ├── utils/
│   │   │   └── api.js       # API client utilities
│   │   ├── App.jsx          # Root component with routing
│   │   ├── main.jsx         # Application entry point
│   │   └── index.css        # Global styles
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── postcss.config.js    # PostCSS configuration
│
├── API_DOCUMENTATION.md     # Complete API Reference
├── ARCHITECTURE.md          # Program's architecture guide
├── QUICK_START.md           # Quick start guide
└── README.md                # This file
```

## 🚀 Installation & Setup

### Prerequisites

- **Node.js**: Versi 20.19.0 or >= 22.12.0
- **npm**: berbarengan Node.js

### Backend Setup

1. Masuk ke folder backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Jalan server backend:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Default backend akan berjalan di `http://localhost:5000`.

### Frontend Setup

1. Masuk ke file frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan server dev:
```bash
npm run dev
```

Frontend akan tersedia di `http://localhost:3000` dan (jika dikonfigurasi) otomatis mem-proxy request ke backend.

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```

Build production tersedia di `frontend/dist`.

**Preview production build:**
```bash
npm run preview
```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check

**GET** `/api/health`

Mengambalikan status server dan timestamp.

**Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2025-01-11T14:30:00.000Z"
}
```

### Devices API

#### Get All Devices
**GET** `/api/devices`

Mengambil semua device yang teregister.

**Query Parameters:**
- `status` (optional): Filter berdasarkan status device (`online` atau `offline`)

**Response:**
```json
[
  {
    "id": "rfid_001",
    "name": "Main Entrance RFID Reader",
    "type": "rfid_reader",
    "location": "Building A - Main Entrance",
    "status": "online",
    "lastActive": "2025-01-11T14:30:00Z",
    "readings": {
      "lastCardId": "CARD-8472",
      "lastScanTime": "2025-01-11T14:28:15Z",
      "totalScansToday": 147,
      "battery": 92,
      "signalStrength": 85
    }
  }
]
```

#### Get Device by ID
**GET** `/api/devices/:id`

Mengembalikan suatu device berdasarkan ID.

**Response:**
```json
{
  "id": "rfid_001",
  "name": "Main Entrance RFID Reader",
  "type": "rfid_reader",
  "location": "Building A - Main Entrance",
  "status": "online",
  "lastActive": "2025-01-11T14:30:00Z",
  "readings": { ... }
}
```

#### Update Device Status
**POST** `/api/devices/:id/status`

Mengupdate status sebuah device.

**Request Body:**
```json
{
  "status": "online"
}
```

**Response:**
```json
{
  "id": "rfid_001",
  "status": "online",
  "lastActive": "2025-01-11T14:30:00Z",
  ...
}
```

### Analytics API

#### Get Analytics Data
**GET** `/api/analytics`

Mengambil data analytic yang komprehensif berdasarkan temperature, humidity, RFID scans, energy consumption, dan soil moisture trends.

**Response:**
```json
{
  "temperature": [
    {
      "date": "2025-01-05",
      "value": "28.5",
      "min": "24.2",
      "max": "31.8"
    }
  ],
  "humidity": [
    {
      "date": "2025-01-05",
      "value": "65",
      "min": "58",
      "max": "72"
    }
  ],
  "rfidScans": [
    {
      "date": "2025-01-05",
      "mainEntrance": 147,
      "officeFloor": 89
    }
  ],
  "energyConsumption": [
    {
      "date": "2025-01-05",
      "lights": "18.5",
      "outlets": "35.2",
      "total": "53.7"
    }
  ],
  "soilMoisture": [
    {
      "date": "2025-01-05",
      "reception": "45",
      "garden": "32"
    }
  ],
  "summary": {
    "avgTemperature": "28.5",
    "avgHumidity": "64",
    "totalDevices": 12,
    "onlineDevices": 11,
    "offlineDevices": 1,
    "totalRFIDScansToday": 236,
    "totalEnergyToday": "65.8",
    "plantHealthScore": 85,
    "weatherCondition": "Sunny"
  }
}
```

#### Get Device Type Distribution
**GET** `/api/analytics/device-types`

Mengambil data distribusi device berdasarkan tipe.

**Response:**
```json
[
  {
    "type": "RFID Readers",
    "count": 2,
    "percentage": 17
  },
  {
    "type": "Smart Lights",
    "count": 2,
    "percentage": 17
  }
]
```

#### Get RFID Statistics
**GET** `/api/analytics/rfid-stats`

Mengambil statistic akses RFID.

**Response:**
```json
{
  "todayScans": 236,
  "uniqueCards": 47,
  "peakHour": "09:00",
  "avgResponseTime": "0.3s",
  "accessDenied": 2
}
```

#### Get Energy Statistics
**GET** `/api/analytics/energy-stats`

Mengambil statistic energy consumption.

**Response:**
```json
{
  "totalToday": "65.8 kWh",
  "lights": "22.4 kWh",
  "outlets": "43.4 kWh",
  "estimatedCost": "Rp 98,700",
  "comparedToYesterday": "-8%"
}
```

### Live Data API

#### Get All Live Data
**GET** `/api/live`

Mengambil sensor readings real-time setiap device.

**Response:**
```json
{
  "temperature": "28.5",
  "temperature": "28.5",
  "recentScans": 15,
  "activeCards": 45,
  "totalPowerConsumption": "55.2",
  "lightsOn": 2,
  "outletsOn": 1,
  "avgSoilMoisture": "38",
  "plantsNeedWater": 0,
  "activeScales": 1,
  "updatedAt": "2025-01-11T14:30:00.000Z"
}
```

#### Get Live Data by Device Type
**GET** `/api/live/type/:deviceType`

Mengambil data real-time berdasarkan tipe device.

**Supported Device Types:**
- `rfid_reader`
- `smart_light`
- `smart_outlet`
- `plant_watering`
- `weather_sensor`
- `weight_scale`

**Response Example (RFID Reader):**
```json
{
  "deviceType": "rfid_reader",
  "lastCardId": "CARD-8472",
  "scansInLastHour": 25,
  "signalStrength": 85,
  "battery": 92,
  "updatedAt": "2025-01-11T14:30:00.000Z"
}
```

#### Get Live Data by Device ID
**GET** `/api/live/:deviceId`

Mengambil data real-time untuk device spesifik.

**Response:**
```json
{
  "deviceId": "rfid_001",
  "temperature": "28.5",
  "temperature": "28.5",
  "weather": "Sunny",
  "updatedAt": "2025-01-11T14:30:00.000Z"
}
```

### Logs API

#### Get All Logs
**GET** `/api/logs`

Mengambil activity logs dengan opsi filtering.

**Query Parameters:**
- `severity` (optional): Filter berdasarkan severity (`info`, `warning`, `error`)
- `device` (optional): Filter berdasarkan device ID
- `search` (optional): Search data log messages

**Response:**
```json
[
  {
    "id": "log_001",
    "timestamp": "2025-01-11T14:30:15Z",
    "severity": "info",
    "device": "rfid_001",
    "message": "Card CARD-8472 scanned successfully - Access granted"
  }
]
```

#### Create Log Entry
**POST** `/api/logs`

Membuat entry log baru.

**Request Body:**
```json
{
  "severity": "info",
  "device": "rfid_001",
  "message": "Device status updated"
}
```

**Response:**
```json
{
  "id": "log_1704972615000",
  "timestamp": "2025-01-11T14:30:15Z",
  "severity": "info",
  "device": "rfid_001",
  "message": "Device status updated"
}
```

## 🎨 Frontend Documentation

### Component Structure

#### Layout Component (`layouts/Layout.jsx`)
- Layout utama dengan sidebar navigation
- Design Responsive (mobile + desktop)
- Navigation: Dashboard, Devices, Analytics, Logs, Settings

#### Dashboard Page (`pages/Dashboard.jsx`)
- Real-time monitoring (auto-refresh live data setiap 3 detik)
- Menampilkan:
  - Device status statistics
  - Environmental metrics (temperature, humidity, power)
  - Device type statistics
  - Interactive charts (temperature, RFID activity, energy)
  - Recent activity logs
  - Live sensor readings grid

#### Devices Page (`pages/Devices.jsx`)
- Daftar device dengan filtering
- Device detail modal
- Kontrol status device (update online/offline)

#### Analytics Page (`pages/Analytics.jsx`)
- Visualisasi analytics :
  - 7-day trend charts
  - Device type distribution
  - Energy consumption breakdown
  - RFID access statistics

#### Logs Page (`pages/Logs.jsx`)
- Menampilkan activity log
- Filter berdasarkan severity/device/keyword
- Real-time new logs feed
- Color-coded berdasarkan severity

#### Settings Page (`pages/Settings.jsx`)
- System preferences & platform settings
- Notification management with global toggle
- Test notification functionality
- Refresh interval, chart smoothing, etc.

### API Client (`utils/api.js`)

API client ini memberikan metode untuk berinteraksi dengan backend:

```javascript
// Device API
deviceAPI.getAll(status)
deviceAPI.getById(id)
deviceAPI.updateStatus(id, status)

// Live Data API
liveAPI.getData()
liveAPI.getDeviceData(deviceId)

// Logs API
logsAPI.getAll(params)
logsAPI.addLog(log)

// Analytics API
analyticsAPI.getData()
analyticsAPI.getDeviceTypes()

// Health API
healthAPI.check()
```

### Routing

Web ini menggunakan React Router untuk client-side routing:

- `/` - Dashboard (default)
- `/devices` - Device management
- `/analytics` - Analytics and trends
- `/logs` - Activity logs
- `/settings` - Settings

### Styling

- **Tailwind CSS**: untuk utility classes
- **Dark Mode**: Pengganti theme automatic sesuai dengan system
- **Responsive Design**: mobile-first dengan breakpoint Tailwind

## 💻 Development Guide

### Backend Development

1. **Menambah Route baru:**
   - Tambahkan file baru di `backend/routes/`
   - Export Express router
   - Import dan gunakan di `server.js`

2. **Data Storage:**
   - Saat ini menggunakan JSON files di `backend/data/`
   - Untuk production, migrasi ke DB (MongoDB, PostgreSQL, dsb.)

3. **Environment Variables:**
   - Buat `.env` untuk konfigurasi (contoh: PORT=5000, NODE_ENV=production)

### Frontend Development

1. **Menambah Page:**
   - Tambahkan component di `frontend/src/pages/`
   - Tambahkan route di `App.jsx`
   - Tambahkan menu/navigation di `Layout.jsx`

2. **Menambah API methods:**
   - Kembangkan `utils/api.js` (axios instance) untuk konsistensi

3. **Styling Guidelines:**
   - Gunakan Tailwind utility classes
   - Ikuti pola komponen yang ada
   - Pastikan kompatibilitas dark mode

### Code Style

- Gunakan ES6+ syntax
- Functional components + hooks (React)
- Nama variable/fungsi yang sesuai
- Tambahkan komentar bila logic kompleks

## 🚢 Deployment

### Backend Deployment

1. Set environment variables:
```bash
PORT=5000
NODE_ENV=production
```

2. Install production dependencies:
```bash
cd backend
npm install --production
```

3. Start server:
```bash
npm start
```

### Frontend Deployment

1. Build production bundle:
```bash
cd frontend
npm run build
```

2. Serve `dist` pakai web server (nginx, Apache, atau simple Node static server)

3. Atur proxy / CORS agar frontend -> backend bekerja di environment production

### Docker Deployment (Optional)

Buat `Dockerfile` untuk backend & frontend, atau gunakan docker-compose untuk stack lengkap

## 🔮 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication and authorization
- [ ] WebSocket support for real-time updates
- [ ] Device configuration management
- [x] ~~Alert and notification system~~ ✅ **Completed**
- [ ] Export functionality (CSV, PDF)
- [ ] Mobile app support
- [ ] Multi-tenant support
- [ ] Advanced analytics and machine learning insights
- [ ] Device firmware update management

---

**IoLytics** - Empowering IoT device monitoring and analytics
