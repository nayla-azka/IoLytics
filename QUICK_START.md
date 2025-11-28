# IoLytics Quick Start Guide

## Prasyarat

- **Node.js** 20.19.0 or >= 22.12.0
- **npm** (sudah termasuk dalam Node.js)

## Langkah Instalasi

### 1. Clone atau Masuk ke Project

```bash
cd IoLytics
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Jalankan Aplikasi

### Opsi 1: Jalankan Kedua Service (Direkomendasikan)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

Backend akan berjalan di `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

### Opsi 2: Mode Development (Auto-reload)

**Terminal 1 - Backend (dengan nodemon):**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Akses Aplikasi

1. Buka browser
2. Buka `http://localhost:3000`
3. Dashboard akan diload secara otomatis

## Verifikasi Instalasi

### Cek Backend Health

```bash
curl http://localhost:5000/api/health
```

Response yang diharapkan:
```json
{
  "status": "Server is running",
  "timestamp": "2025-01-11T14:30:00.000Z"
}
```

### Cek Frontend

- Buka `http://localhost:3000` di browser
- Dashboard IoLytics seharusnya akan muncul
- Navigasi seharusnya berjalan normal

## Masalah Umum

### Port Sudah Dipakai

**Backend (Port 5000):**
```bash
# Windows
netstat -ano | findstr :5000
# Matikan process atau ganti PORT di server.js

# Linux/Mac
lsof -ti:5000 | xargs kill
```

**Frontend (Port 3000):**
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -ti:3000 | xargs kill
```

atau ganti port nya di `vite.config.js`:
```javascript
server: {
  port: 3001, // ganti ke port yang berbeda
}
```

### Module Not Found Errors

```bash
# Hapus node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

Pastikan backend berjalan sebelum memulai frontend. Frontend otomatis mem-proxy request API ke `http://localhost:5000`.

## Langkah Selanjutnya

1. **Explore Dashboard**: Lihat monitoring perangkat real-time
2. **Cek Devices**: Lihat seluruh IoT devices pada halaman Devices
3. **Lihat Analytics**: Lihat tren dan statistik
4. **Review Logs**: Review aktivitas logs aplikasi

## Tips Development 

### Backend Development

- Gunakan `npm run dev` untuk auto-reload ketika file berubah
- Lihat log server di terminal
- Endpoint API tersedia di `http://localhost:5000/api`

### Frontend Development

- HMR aktif secara default
- Perubahan langsung muncul di browser
- Cek browser console untuk error
- Gunakan React DevTools untuk debugging

### Testing API Endpoints

Gunakan curl, Postman, atau browser:

```bash
# Get all devices
curl http://localhost:5000/api/devices

# Get analytics
curl http://localhost:5000/api/analytics

# Get live data
curl http://localhost:5000/api/live
```

## Project Structure

```
IoLytics/
├── backend/
│   ├── server.js          # Start here for backend
│   ├── routes/            # API route handlers
│   └── data/              # JSON data files
│
└── frontend/
    ├── src/
    │   ├── App.jsx        # Main app component
    │   └── pages/         # Page components
    └── vite.config.js     # Vite configuration
```

## Butuh Bantuan?

- Cek [README.md](README.md) untuk dokumentasi lengkap
- Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) untul API details
- Lihat [ARCHITECTURE.md](ARCHITECTURE.md) untuk system design

## Troubleshooting

### Backend tidak mau mulai
- Cek versi Node.js: `node --version`
- Verifikasi dependencies: `npm list`
- Cek syntax errors di `server.js`

### Frontend tidak mau mulai
- Cek versi Node.js: `node --version`
- Clear cache: `rm -rf node_modules .vite`
- Reinstall: `npm install`

### API requests gagal
- Pastikan backend berjalan di port 5000
- Cek configuration CORS
- Verifikasi proxy settings di `vite.config.js`

### Data tidak muncul
- Cek browser console untuk errors
- Verifikasi bahwa backend merespon: `curl http://localhost:5000/api/health`
- Cek network tab di browser DevTools

---

**Happy Coding! 🚀**
