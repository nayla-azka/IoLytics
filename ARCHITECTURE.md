# IoLytics Architecture Documentation

Dokumen ini menjelaskan arsitektur, keputusan desain, serta detail implementasi teknis dari platform IoLytics.

## System Overview

IoLytics adalah aplikasi monitoring IoT full-stack dengan pemisahan yang jelas antara frontend dan backend. Sistem ini mengikuti pola arsitektur RESTful API dengan frontend berupa single-page application (SPA).

```
┌─────────────────┐
│   React Frontend │
│   (Port 3000)    │
└────────┬─────────┘
         │ HTTP/REST
         │
┌────────▼─────────┐
│  Express Backend │
│   (Port 5000)    │
└────────┬─────────┘
         │
┌────────▼─────────┐
│  JSON File Store │
│  (data/*.json)   │
└──────────────────┘
```

## Architecture Layers

### 1. Presentation Layer (Frontend)

**Technology Stack:**
- React 18 (functional components + hooks)
- React Router DOM untuk client-side routing
- Vite sebagai development server + bundler
- Tailwind CSS untuk styling
- Recharts untuk visualisasi data

**Key Components:**
- **Layout Component**: struktur UI utama + navigasi
- **Page Components**: Dashboard, Devices, Analytics, Logs, Settings
- **Context Providers**: NotificationContext untuk notifikasi global
- **Common Components**: Toast untuk notifications
- **API Client**: Axios wrapper untuk komunikasi backend

**Responsibilities:**
- Rendering UI
- Menghandle UX
- Visualisasi Data
- Client-side routing
- Komunikasi API
- State management (local component state)

### 2. Application Layer (Backend)

**Technology Stack:**
- Node.js runtime
- Express.js web framework
- CORS middleware untuk cross-origin requests
- File system untuk data persistence

**Key Components:**
- **Server**: setup Express
- **Routes**: handler per resource
- **Data Layer**: storage berbasis file JSON

**Responsibilities:**
- Menangani HTTP request
- Mengeksekusi Business logic
- Validasi Data
- Menangani Error
- Manajemen API endpoint

### 3. Data Layer

**Implementasi Saat Ini:**
- Penyimpanan berbasis JSON file
- File: `devices.json`, `logs.json`
- I/O file synchronous

**Pertimbangan Kedepannya:**
- Migrasi ke Database (MongoDB, PostgreSQL, etc.)
- Abstraksi data persistence layer
- Caching layer (Redis)
- Data backup dan recovery

## Components Architecture

### Frontend Components Hierarchy

```
App
└── NotificationProvider
    └── Router
        ├── ToastContainer
        └── Layout
            ├── Sidebar (Navigation)
            └── Outlet (Page Content)
                ├── Dashboard
                │   ├── StatCards
                │   ├── Charts
                │   └── LiveReadings
                ├── Devices
                │   ├── DeviceList
                │   └── DeviceCard
                ├── Analytics
                │   └── AnalyticsCharts
                ├── Logs
                │   └── LogList
                └── Settings
                    └── NotificationToggle
    └── ToastContainer
        └── Toast
```

### Backend Route Structure

```
server.js
├── /api/health
├── /api/devices
│   ├── GET / (all devices)
│   ├── GET /:id (single device)
│   └── POST /:id/status (update status)
├── /api/analytics
│   ├── GET / (all analytics)
│   ├── GET /device-types
│   ├── GET /rfid-stats
│   └── GET /energy-stats
├── /api/live
│   ├── GET / (all live data)
│   ├── GET /type/:deviceType
│   └── GET /:deviceId
└── /api/logs
    ├── GET / (all logs with filters)
    └── POST / (create log)
```

## Data Flow

### Reading Data Flow

```
User Action
    ↓
Frontend Component
    ↓
API Client (utils/api.js)
    ↓
HTTP Request (Axios)
    ↓
Express Route Handler
    ↓
File System Read
    ↓
JSON Parse
    ↓
Response JSON
    ↓
Frontend State Update
    ↓
UI Re-render
```

### Writing Data Flow

```
User Action
    ↓
Frontend Component
    ↓
API Client Method
    ↓
HTTP POST/PUT Request
    ↓
Express Route Handler
    ↓
Data Validation
    ↓
File System Write
    ↓
Response JSON
    ↓
Frontend State Update
    ↓
UI Re-render
```

## Design Patterns

### 1. RESTful API

The backend mengikuti REST principles:
- URLs berbasis resource (`/api/devices`, `/api/logs`)
- Metode HTTP (GET, POST)
- Stateless requests
- JSON request/response format

### 2. Component Composition

Frontend menggunakan komposisi komponen React:
- Reusable stateless components
- Container/presentational component pattern
- Props-based data flow

### 3. Separation of Concerns

- **Frontend**: UI/UX, presentation logic
- **Backend**: Business logic, data management
- **Data Layer**: Data persistence

### 4. Modular Route Handling

Backend routes terorganisir berdasarkan modul:
- Setiap file route menghandle file resource nya tersendiri
- Pendaftaran route yang terpusat di `server.js`
- Mudah untuk diperluas dan dimaintain

## State Management

### Frontend State

Menggunakan state manajemen bawaan React:
- `useState` hook untuk state component local
- `useEffect` hook untuk side effects dan data fetching
- Tidak ada library state management global (Redux, Zustand, etc.)

**Distribusi State:**
- Setiap komponen di suatu halaman memanage statenya sendiri
- Respon API tersimpan di component state 
- **Notification State**: Dimanage melalui Context API (NotificationContext)
- Tidak ada state yang digunakan oleh lebih dari satu component (kecuali notifications)

**Pertimbangan Kedepannya:**
- Mengimplementasikan global state management untuk shared data
- Mempertimbangkan menggunakan Redux Toolkit or Zustand
- Mengimplementasikan state persistence

### Backend State

- Design Stateless
- Semua state tersimpan di JSON files
- Tidak ada shared memory state

## Data Models

### Device Model

```javascript
{
  id: string,              // Unique identifier
  name: string,            // Display name
  type: string,            // Device type
  location: string,        // Physical location
  status: 'online'|'offline',
  lastActive: ISO8601,    // Timestamp
  readings: {              // Device-specific data
    // Varies by device type
  }
}
```

### Log Model

```javascript
{
  id: string,              // Unique identifier
  timestamp: ISO8601,      // Event timestamp
  severity: 'info'|'warning'|'error',
  device: string,          // Device ID
  message: string          // Log message
}
```

## Security Considerations

### Current Implementations

1. **CORS**: Enabled untuk semua origins (development)
2. **No Authentication**: Akses API Public
3. **No Rate Limiting**: Tidak ada rate limiting
4. **Input Validation**: Validasi dasar
5. **Error Messages**: Error message sederhana

### Production Recommended

1. **Authentication & Authorization**
   - Menggunakan autentikasi JWT-based
   - Role-based access control (RBAC)
   - API key management

2. **CORS Configuration**
   - Batasi untuk origins tertentu
   - Config method dan header yang diperbolehkan

3. **Rate Limiting**
   - Mengimplementasikan request rate limiting
   - Per-IP atau per-user limits
   - Menggunakan middleware seperti `express-rate-limit`

4. **Input Validation**
   - Menggunakan library validasi (Joi, express-validator)
   - Mengamankan user inputs
   - Validasi data types dan ranges

5. **Security Headers**
   - Helmet.js untuk security headers
   - HTTPS enforcement
   - Content Security Policy (CSP)

6. **Data Protection**
   - Encrypt sensitive data dalam rest
   - Menggunakan HTTPS untuk data di transit
   - Mengimplementasikan data backup strategies

## Performance Considerations

### Frontend Optimization

1. **Code Splitting**
   - Route-based code splitting (React.lazy)
   - Component lazy loading

2. **Asset Optimization**
   - Vite menghandle bundling dan minification
   - Tree shaking untuk code yang tidak terpakai
   - Image optimization

3. **Rendering Optimization**
   - React.memo untuk component memoization
   - useMemo dan useCallback untuk expensive operations
   - Virtual scrolling untuk long lists

4. **API Optimization**
   - Request debouncing/throttling
   - Client-side caching
   - Parallel API requests

### Backend Optimization

1. **File I/O**
   - Saat ini: Operasi file synchronous
   - Masa Depan: Operasi file Async atau database
   - Caching data yang sering diakses

2. **Response Optimization**
   - JSON compression (gzip)
   - Pagination untuk datasets besar
   - Field selection (hanya kembalikan data yang dibutukan)

3. **Caching Strategy**
   - In-memory caching untuk data analytics
   - Cache invalidation strategies
   - Redis untuk caching yang terdistribusi

## Scalability

### Current Limitations

1. **Single Server**: Tidak ada scaling horizontal
2. **File-based Storage**: Tidak cocok untuk concurrency yang tinggi
3. **No Load Balancing**: Tidak ada load balancer
4. **Synchronous Operations**: Menghalangi I/O operations

### Scalability Improvements

1. **Database Migration**
   - Berganti dari JSON files ke database
   - Mengsupport concurrent reads/writes
   - Kemampuan query yang lebih baik

2. **Horizontal Scaling**
   - Design backend stateless (sudah diimplementasi)
   - Load balancer untuk lebih dari satu instances
   - Shared database/storage

3. **Caching Layer**
   - Redis untuk session dan data caching
   - CDN untuk static assets
   - Browser caching strategies

4. **Message Queue**
   - Untuk async operations
   - Event-driven architecture
   - Background job processing

## Error Handling

### Frontend Error Handling

- Try-catch blocks dalam async functions
- Error boundaries untuk React components
- Error messages yang user-friendly
- Console logging untuk debugging

### Backend Error Handling

- Try-catch blocks dalam route handlers
- Format error response yang konsisten
- Penggunaan HTTP status code
- Error logging (kendapannya: logging yang terstruktur)

## Testing Strategy

### Current State

- Tidak ada test otomatis yang diimplementasikan

### Recommended Testing

1. **Frontend Testing**
   - Unit tests (Jest, React Testing Library)
   - Component tests
   - Integration tests
   - E2E tests (Playwright, Cypress)

2. **Backend Testing**
   - Unit tests (Jest, Mocha)
   - API integration tests
   - Route handler tests
   - Data validation tests

3. **Test Coverage**
   - Tergetkan untuk 80%+ code coverage
   - Critical path testing
   - Edge case testing

## Deployment Architecture

### Development Environment

```
Frontend (Vite Dev Server) → Backend (Node.js) → JSON Files
```

### Production Architecture (Recommended)

```
┌─────────────┐
│   CDN/      │
│  Static     │
│  Assets     │
└─────────────┘
       │
┌──────▼──────┐      ┌──────────────┐
│   Load      │      │   Database   │
│  Balancer   │──────│  (MongoDB/   │
└──────┬──────┘      │  PostgreSQL) │
       │             └──────────────┘
┌──────▼──────┐
│  Backend    │
│  Instances  │
│  (Express) │
└─────────────┘
```

## Monitoring & Observability

### Current State

- Console logging dasar
- Tidak ada infrastruktur monitoring

### Recommended Monitoring

1. **Application Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring (New Relic, Datadog)
   - Uptime monitoring

2. **Logging**
   - Structured logging (Winston, Pino)
   - Log aggregation (ELK stack, CloudWatch)
   - Log levels dan filtering

3. **Metrics**
   - API response times
   - Error rates
   - Request volumes
   - System resource usage

## Future Enhancements

### Short-term

1. Database integration
2. Authentication system
3. WebSocket support untuk real-time updates
4. Error handling yang diperbarui
5. Input validation yang diperbarui

### Long-term

1. Microservices architecture
2. Event-driven architecture
3. Machine learning untuk predictive analytics
4. Mobile application
5. Multi-tenant support
5. Advanced analytics dan reporting
6. Device firmware management
7. ~~Alert dan notification system~~ ✅ **Completed**

## Kesimpulan

IoLytics dibangun dengan fondasi arsitektur modern dan scalable, cocok untuk monitoring IoT. Pemisahan yang jelas antara frontend, backend, dan data layer membuat sistem mudah dikembangkan dan dipelihara. Migrasi ke database, caching, dan real-time update akan meningkatkan kemampuan platform di masa depan.