// API.js

import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const deviceAPI = {
  getAll: (status) => api.get('/devices', { params: { status } }),
  getById: (id) => api.get(`/devices/${id}`),
  updateStatus: (id, status) => api.post(`/devices/${id}/status`, { status }),
}

export const liveAPI = {
  getData: () => api.get('/live'),
  getDeviceData: (deviceId) => api.get(`/live/${deviceId}`),
}

export const logsAPI = {
  getAll: (params) => api.get('/logs', { params }),
  addLog: (log) => api.post('/logs', log),
}

export const analyticsAPI = {
  getData: () => api.get('/analytics'),
  getDeviceTypes: () => api.get('/analytics/device-types'),
}

export const healthAPI = {
  check: () => api.get('/health'),
}

export default api