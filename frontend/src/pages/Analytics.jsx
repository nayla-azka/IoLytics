// Analytics.jsx

import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Activity, CreditCard, Zap, Sprout, CloudRain } from 'lucide-react'
import { analyticsAPI } from '../utils/api'

const COLORS = ['#a855f7', '#06b6d4', '#f97316', '#10b981', '#fbbf24', '#ef4444']

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [deviceTypes, setDeviceTypes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, typesRes] = await Promise.all([
        analyticsAPI.getData(),
        analyticsAPI.getDeviceTypes(),
      ])
      setAnalytics(analyticsRes.data)
      setDeviceTypes(typesRes.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Comprehensive insights from your IoT ecosystem
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          icon={<CloudRain className="text-blue-500" />}
          title="Avg Temperature"
          value={`${analytics.summary.avgTemperature}°C`}
          subtitle="Weather Stations"
        />
        <SummaryCard
          icon={<CreditCard className="text-purple-500" />}
          title="RFID Scans Today"
          value={analytics.summary.totalRFIDScansToday}
          subtitle="Access Control"
        />
        <SummaryCard
          icon={<Zap className="text-yellow-500" />}
          title="Energy Today"
          value={`${analytics.summary.totalEnergyToday} kWh`}
          subtitle="Smart Devices"
        />
        <SummaryCard
          icon={<Sprout className="text-green-500" />}
          title="Plant Health"
          value={`${analytics.summary.plantHealthScore}%`}
          subtitle="Irrigation System"
        />
      </div>

      {/* Weather & Environment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CloudRain size={20} className="text-blue-500" />
            Weather Station - Temperature (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.temperature}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Avg °C"
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="max"
                name="Max °C"
                stroke="#ef4444"
                strokeWidth={1}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="min"
                name="Min °C"
                stroke="#06b6d4"
                strokeWidth={1}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Humidity Trend (Renamed to Plant Monitor) */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CloudRain size={20} className="text-cyan-500" />
            Plant Monitor - Humidity (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.humidity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Avg %"
                stroke="#06b6d4"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Access Control & Energy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RFID Access Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-purple-500" />
            RFID Access Control (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.rfidScans}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="mainEntrance" name="Main Entrance" fill="#a855f7" />
              <Bar dataKey="officeFloor" name="Office Floor" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Energy Consumption */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap size={20} className="text-yellow-500" />
            Energy Consumption (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.energyConsumption}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="lights"
                name="Smart Lights (kWh)"
                stroke="#fbbf24"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="outlets"
                name="Smart Outlets (kWh)"
                stroke="#f97316"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="total"
                name="Total (kWh)"
                stroke="#10b981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Device Type Distribution (Soil Moisture Removed) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity size={20} className="text-primary-600" />
            Device Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, count }) => `${type} (${count})`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {deviceTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {deviceTypes.map((type, index) => (
              <div key={type.type} className="flex items-center gap-2 text-sm">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-700 dark:text-gray-300">{type.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">System Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <MetricItem
            label="Total Devices"
            value={analytics.summary.totalDevices}
            color="blue"
          />
          <MetricItem
            label="Online Now"
            value={analytics.summary.onlineDevices}
            color="green"
          />
          <MetricItem
            label="Offline"
            value={analytics.summary.offlineDevices}
            color="red"
          />
          <MetricItem
            label="Weather"
            value={analytics.summary.weatherCondition}
            color="cyan"
          />
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ icon, title, value, subtitle }) {
  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

function MetricItem({ label, value, color }) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
  }

  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${colorClasses[color]}`}>{value}</p>
    </div>
  )
}