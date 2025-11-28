// Dashboard.jsx

import { useState, useEffect } from 'react'
import { Activity, Thermometer, Droplets, Wifi, CreditCard, Zap, Sprout, Weight } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { deviceAPI, liveAPI, logsAPI, analyticsAPI } from '../utils/api'

export default function Dashboard() {
  const [devices, setDevices] = useState([])
  const [liveData, setLiveData] = useState(null)
  const [logs, setLogs] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(() => {
      fetchLiveData()
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [devicesRes, logsRes, analyticsRes] = await Promise.all([
        deviceAPI.getAll(),
        logsAPI.getAll({ limit: 5 }),
        analyticsAPI.getData(),
      ])

      setDevices(devicesRes.data)
      setLogs(logsRes.data)
      setAnalytics(analyticsRes.data)
      await fetchLiveData()
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLiveData = async () => {
    try {
      const res = await liveAPI.getData()
      setLiveData(res.data)
    } catch (error) {
      console.error('Error fetching live data:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  const onlineDevices = devices.filter(d => d.status === 'online').length
  const offlineDevices = devices.filter(d => d.status === 'offline').length

  // Count devices by type
  const rfidCount = devices.filter(d => d.type === 'rfid_reader').length
  const lightsOn = liveData?.lightsOn || 0

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Wifi className="text-green-500" />}
          title="Online Devices"
          value={onlineDevices}
          total={devices.length}
          color="green"
        />
        <StatCard
          icon={<Thermometer className="text-orange-500" />}
          title="Temperature"
          value={liveData?.temperature || '—'}
          unit="°C"
          color="orange"
        />
        <StatCard
          icon={<Zap className="text-yellow-500" />}
          title="Power Usage"
          value={liveData?.totalPowerConsumption || '—'}
          unit="W"
          color="yellow"
        />
        <StatCard
          icon={<CreditCard className="text-purple-500" />}
          title="RFID Scans"
          value={liveData?.recentScans || 0}
          unit="/hr"
          color="purple"
        />
      </div>

      {/* Device Type Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MiniStatCard
          icon={<CreditCard size={18} />}
          label="Active Cards"
          value={liveData?.activeCards || 0}
          subtext="currently active"
        />
        <MiniStatCard
          icon={<Zap size={18} />}
          label="Lights Active"
          value={`${lightsOn}/2`}
          subtext="devices on"
        />
        <MiniStatCard
          icon={<Sprout size={18} />}
          label="Plants Needing Water"
          value={liveData?.plantsNeedWater || 0}
          subtext="attention needed"
        />
        <MiniStatCard
          icon={<Weight size={18} />}
          label="Active Scales"
          value={`${liveData?.activeScales || 0}/2`}
          subtext="in use"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Thermometer size={20} className="text-orange-500" />
            Weather Station - Temperature (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics?.temperature || []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-700" />
              <XAxis dataKey="date" className="text-xs" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: '#f97316' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RFID Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-purple-500" />
            RFID Access Activity (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics?.rfidScans || []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-700" />
              <XAxis dataKey="date" className="text-xs" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="mainEntrance" name="Main Entrance" fill="#a855f7" />
              <Bar dataKey="officeFloor" name="Office Floor" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Energy & Plant Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Consumption */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap size={20} className="text-yellow-500" />
            Energy Consumption (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics?.energyConsumption || []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-700" />
              <XAxis dataKey="date" className="text-xs" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="lights" stroke="#fbbf24" strokeWidth={2} name="Lights (kWh)" />
              <Line type="monotone" dataKey="outlets" stroke="#f97316" strokeWidth={2} name="Outlets (kWh)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Logs */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Activity Logs</h3>
          <div className="space-y-2">
            {logs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full mt-1.5 ${log.severity === 'error'
                    ? 'bg-red-500'
                    : log.severity === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                    }`}
                />
                <div className="flex-1">
                  <p className="text-sm">{log.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getDeviceTypeName(log.device)} • {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Readings Grid */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Live Sensor Readings</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <LiveReading label="Temperature" value={liveData?.temperature} unit="°C" />
          <LiveReading label="Active Cards" value={liveData?.activeCards} />
          <LiveReading label="Power Usage" value={liveData?.totalPowerConsumption} unit="W" />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Last updated: {liveData?.updatedAt ? new Date(liveData.updatedAt).toLocaleTimeString() : '—'}
        </p>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, total, unit, color }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {value}
            {unit && <span className="text-lg ml-1">{unit}</span>}
            {total && <span className="text-sm text-gray-500 ml-1">/ {total}</span>}
          </p>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  )
}

function MiniStatCard({ icon, label, value, subtext }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>
    </div>
  )
}

function LiveReading({ label, value, unit }) {
  return (
    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-xl font-bold mt-1">
        {value || '—'}
        {value && unit && <span className="text-sm ml-1">{unit}</span>}
      </p>
    </div>
  )
}

function getDeviceTypeName(deviceId) {
  if (deviceId.startsWith('rfid')) return 'RFID Reader'
  if (deviceId.startsWith('light')) return 'Smart Light'
  if (deviceId.startsWith('outlet')) return 'Smart Outlet'
  if (deviceId.startsWith('plant')) return 'Plant Monitor'
  if (deviceId.startsWith('weather')) return 'Weather Station'
  if (deviceId.startsWith('scale')) return 'Weight Scale'
  return 'Device'
}