# IoLytics API Documentation

Dokumentasi lengkap API untuk IoLytics backend service.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Saat ini API tidak memerlukan authentication. Untuk production deployment, disarankan menggunakan authentication middleware.

## Response Format

Semua response API dalam format JSON. Error response menggunakan struktur berikut:

```json
{
  "error": "Error message description"
}
```

## Status Codes

- `200 OK` - Request berhasil
- `201 Created` - Resource berhasil dibuat
- `404 Not Found` - Resource tidak diterimukan
- `500 Internal Server Error` - Server error

---

## Endpoints

### Health Check

#### GET `/api/health`

Memeriksa status server.

**Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2025-01-11T14:30:00.000Z"
}
```

---

## Devices Endpoints

### Get All Devices

**GET** `/api/devices`

Mengambil semua IoT devices yang terdaftar.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter berdasarkan status: `online` or `offline` |

**Contoh Request:**
```
GET /api/devices
GET /api/devices?status=online
```

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
      "fullName": "John Doe",
      "macAddress": "00:1B:44:11:3A:B7",
      "time": "14:28:15",
      "date": "2025-01-11",
      "school": "Engineering",
      "id": "STU-2025-001"
    }
  }
]
```

**Device Types:**
- `rfid_reader` - RFID access control readers
- `smart_light` - Smart lighting systems
- `smart_outlet` - Smart power outlets
- `plant_watering` - Plant monitoring and watering systems
- `weather_sensor` - Weather monitoring stations
- `weight_scale` - Digital weight scales

**Status Values:**
- `online` - Device aktif dan terhubung
- `offline` - Device tidak terhubung dan tidak ada

---

### Get Device by ID

**GET** `/api/devices/:id`

Mengambil detail sebuah device berdasarkan ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Device unique identifier |

**Contoh Request:**
```
GET /api/devices/rfid_001
```

**Response:**
```json
{
  "id": "rfid_001",
  "name": "Main Entrance RFID Reader",
  "type": "rfid_reader",
  "location": "Building A - Main Entrance",
  "status": "online",
  "lastActive": "2025-01-11T14:30:00Z",
    "fullName": "John Doe",
    "macAddress": "00:1B:44:11:3A:B7",
    "time": "14:28:15",
    "date": "2025-01-11",
    "school": "Engineering",
    "id": "STU-2025-001"
}
```

**Error Response (404):**
```json
{
  "error": "Device not found"
}
```

---

### Update Device Status

**POST** `/api/devices/:id/status`

Mengupdate status device dan otomatis memperbarui `lastActive`.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Device unique identifier |

**Request Body:**
```json
{
  "status": "online"
}
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | Yes | New status: `online` or `offline` |

**Contoh Request:**
```
POST /api/devices/rfid_001/status
Content-Type: application/json

{
  "status": "offline"
}
```

**Response:**
```json
{
  "id": "rfid_001",
  "name": "Main Entrance RFID Reader",
  "type": "rfid_reader",
  "location": "Building A - Main Entrance",
  "status": "offline",
  "lastActive": "2025-01-11T14:35:00Z",
  "readings": { ... }
}
```

**Error Responses:**
- `404` - Device tidak ditemukan
- `500` - Gagal mengupdate device

---

## Analytics Endpoints

### Get Analytics Data

**GET** `/api/analytics`

Mengambil data analytics lengkap untuk 7 hari terakhir.

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

**Data Ranges:**
- Semua data time-series dalam kurun waktu 7 hari terakhir
- tanggal menggunakan ISO 8601 format (YYYY-MM-DD)

---

### Get Device Type Distribution

**GET** `/api/analytics/device-types`

Mengambil distribusi device berdasarkan tipe.

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
  },
  {
    "type": "Smart Outlets",
    "count": 2,
    "percentage": 17
  },
  {
    "type": "Plant Monitors",
    "count": 2,
    "percentage": 17
  },
  {
    "type": "Weather Sensors",
    "count": 2,
    "percentage": 17
  },
  {
    "type": "Weight Scales",
    "count": 2,
    "percentage": 15
  }
]
```

---

### Get RFID Statistics

**GET** `/api/analytics/rfid-stats`

Mengambil statistik pemakaian RFID.

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

**Response Fields:**
- `todayScans` - Total RFID card scans hari ini
- `uniqueCards` - Jumlah unique cards yang discan
- `peakHour` - Jam dengan aktivitas terbanyak (24-hour format)
- `avgResponseTime` - Rata-rata waktu untuk merespons scan cards
- `accessDenied` - Jumlah cards yang gagal discan

---

### Get Energy Statistics

**GET** `/api/analytics/energy-stats`

Mengambil statistik konsumsi energi dan estimasi biaya.

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

**Response Fields:**
- `totalToday` - Total energy consumption hari ini
- `lights` - Energy dikonsumsi oleh smart lights
- `outlets` - Energy dikonsumsi oleh smart outlets
- `estimatedCost` - Perkiraan biaya dalam mata uang lokal
- `comparedToYesterday` - Perubahan persentase dengan kemarin

---

## Live Data Endpoints

### Get All Live Data

**GET** `/api/live`

Mengambil real-time sensor data dari seluruh device.

**Response:**
```json
{
  "temperature": "28.5",
  "humidity": "65",
  "pressure": "1013.25",
  "windSpeed": "12.5",
  "uvIndex": 7,
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

**Response Fields:**
- `temperature` - Temperature terbaru dalam Celsius
- `recentScans` - Scans RFID dalam satu jam terakhir
- `activeCards` - Jumlah RFID cards yang aktif
- `totalPowerConsumption` - Total power dalam watts
- `lightsOn` - Jumlah lampu yang menyala
- `outletsOn` - Jumlah steker yang menyala
- `avgSoilMoisture` - Rata-rata persentase soil moisture
- `plantsNeedWater` - Jumlah tanaman membutuhkan air (0 or 1)
- `activeScales` - Jumlah weight scales yang aktif
- `updatedAt` - ISO 8601 timestamp untuk update terakhir

---

### Get Live Data by Device Type

**GET** `/api/live/type/:deviceType`

Mengambil data live untuk device type tertentu.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `deviceType` | string | Yes | Device type identifier |

**Supported Device Types:**
- `rfid_reader`
- `smart_light`
- `smart_outlet`
- `plant_watering`
- `weather_sensor`
- `weight_scale`

**Contoh Request:**
```
GET /api/live/type/rfid_reader
```

**Contoh Response:**

**RFID Reader:**
```json
{
  "deviceType": "rfid_reader",
  "fullName": "John Doe",
  "macAddress": "00:1B:44:11:3A:B7",
  "time": "14:28:15",
  "date": "2025-01-11",
  "school": "Engineering",
  "id": "STU-2025-001",
  "updatedAt": "2025-01-11T14:30:00.000Z"
}
```

**Smart Light:**
```json
{
  "deviceType": "smart_light",
  "bulbStatus": "On",
  "voltage": 220,
  "current": "0.05",
  "power": "11.0",
  "energy": "10.5",
  "frequency": 50,
  "updatedAt": "2025-01-11T14:30:00.000Z"
}
```

**Smart Outlet:**
```json
{
  "deviceType": "smart_outlet",
  "outletStatus": "On",
  "voltage": 220,
  "current": "2.8",
  "power": "616",
  "energy": "15.2",
  "frequency": 50,
  "updatedAt": "2025-01-11T14:30:00.000Z"
}
```

**Plant Watering:**
```json
{
  "deviceType": "plant_watering",
  "datetime": "2025-01-11T14:30:00.000Z",
  "waterpumpStatus": "Off",
  "soilMoistureStatus": "Moist",
  "humidity": "62"
}
```

**Weather Sensor:**
```json
{
  "deviceType": "weather_sensor",
  "datetime": "2025-01-11T14:30:00.000Z",
  "weather": "Sunny",
  "temperature": "28.5"
}
```

**Weight Scale:**
```json
{
  "deviceType": "weight_scale",
  "datetime": "2025-01-11T14:30:00.000Z",
  "measurement": "45.8"
}
```

**Error Response (404):**
```json
{
  "error": "Device type not found"
}
```

---

### Get Live Data by Device ID

**GET** `/api/live/:deviceId`

Mengambil data live untuk device tertentu.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `deviceId` | string | Yes | Device unique identifier |

**Contoh Request:**
```
GET /api/live/rfid_001
```

**Response:**
```json
{
  "deviceId": "rfid_001",
  "temperature": "28.5",
  "humidity": "65",
  "battery": 92,
  "signal": 85,
  "updatedAt": "2025-01-11T14:30:00.000Z"
}
```

---

## Logs Endpoints

### Get All Logs

**GET** `/api/logs`

Mengambil seluruh activity logs dengan filtering dan sorting opsional.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `severity` | string | No | Filter berdasarkan severity: `info`, `warning`, `error` |
| `device` | string | No | Filter berdasarkan device ID |
| `search` | string | No | Cari berdasarkan pesan log |
| `limit` | number | No | Maks jumlah record |

**Contoh Requests:**
```
GET /api/logs
GET /api/logs?severity=error
GET /api/logs?device=rfid_001
GET /api/logs?search=water
GET /api/logs?limit=10
GET /api/logs?severity=warning&limit=5
```

**Response:**
```json
[
  {
    "id": "log_001",
    "timestamp": "2025-01-11T14:30:15Z",
    "severity": "info",
    "device": "rfid_001",
    "message": "Card CARD-8472 scanned successfully - Access granted"
  },
  {
    "id": "log_002",
    "timestamp": "2025-01-11T14:28:42Z",
    "severity": "warning",
    "device": "plant_002",
    "message": "Soil moisture low (32%) - Watering scheduled in 6 hours"
  }
]
```

**Severity Levels:**
- `info` 
- `warning`
- `error`

**Sorting:**
- Logs diurutkan secara otomatis berdasarkan timestamp(yang terbaru pertama)

---

### Membuat Log Entry

**POST** `/api/logs`

Membuat log baru. ID & timestamp otomatis dibuat.

**Request Body:**
```json
{
  "severity": "info",
  "device": "rfid_001",
  "message": "Device status updated"
}
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `severity` | string | Yes | Log severity: `info`, `warning`, `error` |
| `device` | string | Yes | Device ID yang membuat log |
| `message` | string | Yes | deskripsi log message |

**Contoh Request:**
```
POST /api/logs
Content-Type: application/json

{
  "severity": "info",
  "device": "light_001",
  "message": "Light brightness adjusted to 80%"
}
```

**Response:**
```json
{
  "id": "log_1704972615000",
  "timestamp": "2025-01-11T14:30:15Z",
  "severity": "info",
  "device": "light_001",
  "message": "Light brightness adjusted to 80%"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to add log"
}
```

---

## Rate Limiting

Belum diimplementasikan.
Untuk production, disarankan menambahkan rate limit.

## CORS

Saat ini diizinkan untuk semua origin.
Untuk production, batasi origin yang diperbolehkan.

## Error Handling

Semua endpoint memakai try–catch dan menghasilkan status code standar

- `200` - Success
- `201` - Created
- `404` - Not Found
- `500` - Internal Server Error

Error responses termasuk error messages yang deskriptif.

---

## Data Models

### Device Model

```typescript
interface Device {
  id: string;                    // Unique device identifier
  name: string;                  // Human-readable device name
  type: string;                  // Device type (rfid_reader, smart_light, etc.)
  location: string;              // Physical location description
  status: 'online' | 'offline'; // Device connection status
  lastActive: string;            // ISO 8601 timestamp
  readings: object;              // Device-specific readings
}
```

### Log Model

```typescript
interface Log {
  id: string;                    // Unique log identifier
  timestamp: string;              // ISO 8601 timestamp
  severity: 'info' | 'warning' | 'error';
  device: string;                 // Device ID
  message: string;                // Log message
}
```

---

## Best Practices

1. **Polling Frequency**: Polling tidak lebih sering dari 3 detik

2. **Error Handling**: Selalu handle error http di client

3. **Caching**: Gunakan caching client-side untuk data statis

4. **Pagination**: Gunakan `limit` di logs. 

5. **Timestamps**: Timestamps dalam format ISO 8601 (UTC)

---

## Changelog

### Version 1.0.0
- Initial API release
- Device management endpoints
- Analytics endpoints
- Live data endpoints
- Log management endpoints
