// Devices.jsx

import { useState, useEffect } from 'react'
import { Wifi, WifiOff, Battery, MapPin, Clock } from 'lucide-react'
import { deviceAPI } from '../utils/api'

export default function Devices() {
  const [devices, setDevices] = useState([])
  const [filter, setFilter] = useState('all')
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchDevices()
  }, [filter])

  const fetchDevices = async () => {
    try {
      const params = filter !== 'all' ? filter : undefined
      const res = await deviceAPI.getAll(params)
      setDevices(res.data)
      // Update selected device if it exists
      if (selectedDevice) {
        const updated = res.data.find(d => d.id === selectedDevice.id)
        if (updated) setSelectedDevice(updated)
      }
    } catch (error) {
      console.error('Error fetching devices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeviceClick = (device) => {
    setSelectedDevice(selectedDevice?.id === device.id ? null : device)
  }

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedDevice) return
    setUpdatingStatus(true)
    try {
      await deviceAPI.updateStatus(selectedDevice.id, newStatus)
      await fetchDevices()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update device status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading devices...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Devices</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and monitor your IoT devices
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'online', 'offline'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 md:px-4 py-2 text-sm md:text-base rounded-lg font-medium transition-colors ${filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            isSelected={selectedDevice?.id === device.id}
            onClick={() => handleDeviceClick(device)}
          />
        ))}
      </div>

      {devices.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No devices found with status: {filter}
        </div>
      )}

      {/* Device Details Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold">{selectedDevice.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  ID: {selectedDevice.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedDevice(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <DetailRow label="Type" value={selectedDevice.type} />
              <DetailRow label="Location" value={selectedDevice.location} />
              <DetailRow
                label="Status"
                value={
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${selectedDevice.status === 'online'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}
                  >
                    {selectedDevice.status}
                  </span>
                }
              />
              <DetailRow
                label="Last Active"
                value={new Date(selectedDevice.lastActive).toLocaleString()}
              />

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3">Recent Readings</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedDevice.readings).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </p>
                      <p className="text-lg font-semibold mt-1">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                        {key.includes('battery') && '%'}
                        {key.includes('temperature') && '°C'}
                        {key.includes('humidity') && '%'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3">Change Device Status</h4>

                <div className="flex gap-3">
                  <button
                    disabled={updatingStatus}
                    onClick={() => handleStatusUpdate('online')}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                  >
                    {updatingStatus ? 'Updating...' : 'Set Online'}
                  </button>

                  <button
                    disabled={updatingStatus}
                    onClick={() => handleStatusUpdate('offline')}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                  >
                    {updatingStatus ? 'Updating...' : 'Set Offline'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DeviceCard({ device, isSelected, onClick }) {
  const isOnline = device.status === 'online'

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-primary-500' : ''
        }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{device.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {device.type}
          </p>
        </div>
        {isOnline ? (
          <Wifi className="text-green-500" size={20} />
        ) : (
          <WifiOff className="text-red-500" size={20} />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} className="text-gray-500" />
          <span>{device.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock size={16} className="text-gray-500" />
          <span>{new Date(device.lastActive).toLocaleString()}</span>
        </div>
        {device.readings.battery !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <Battery size={16} className="text-gray-500" />
            <span>{device.readings.battery}%</span>
          </div>
        )}
      </div>

      <div
        className={`mt-4 px-3 py-1 rounded-full text-sm font-medium text-center ${isOnline
          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}
      >
        {isOnline ? 'Online' : 'Offline'}
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}