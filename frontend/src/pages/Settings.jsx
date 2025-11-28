import { useState } from 'react'
import { Save, RefreshCw } from 'lucide-react'
import { useNotification } from '../context/NotificationContext'

export default function Settings() {
  const { enabled, toggleNotifications, addNotification } = useNotification()
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: 3,
    chartSmoothing: true,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    const defaultSettings = {
      autoRefresh: true,
      refreshInterval: 3,
      chartSmoothing: true,
    }
    setSettings(defaultSettings)
  }

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize your dashboard experience
        </p>
      </div>

      {/* Display Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Display</h3>
        <div className="space-y-4">
          <SettingRow
            label="Chart Smoothing"
            description="Apply smooth curves to chart lines"
          >
            <Toggle
              enabled={settings.chartSmoothing}
              onChange={(value) => handleChange('chartSmoothing', value)}
            />
          </SettingRow>
        </div>
      </div>

      {/* Data Refresh Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Data Refresh</h3>
        <div className="space-y-4">
          <SettingRow
            label="Auto Refresh"
            description="Automatically update dashboard data"
          >
            <Toggle
              enabled={settings.autoRefresh}
              onChange={(value) => handleChange('autoRefresh', value)}
            />
          </SettingRow>

          {settings.autoRefresh && (
            <SettingRow
              label="Refresh Interval"
              description="How often to update data (in seconds)"
            >
              <select
                value={settings.refreshInterval}
                onChange={(e) =>
                  handleChange('refreshInterval', parseInt(e.target.value))
                }
                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={1}>1 second</option>
                <option value={3}>3 seconds</option>
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
                <option value={30}>30 seconds</option>
              </select>
            </SettingRow>
          )}
        </div>
      </div>

      {/* Notifications Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="space-y-4">
          <SettingRow
            label="Enable Notifications"
            description="Receive alerts for device events"
          >
            <Toggle
              enabled={enabled}
              onChange={toggleNotifications}
            />
          </SettingRow>
          <div className="flex justify-end">
            <button
              onClick={() => addNotification('test', 'This is a test notification!')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Test Notification
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSave}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Save size={16} />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
        <button
          onClick={handleReset}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} />
          Reset to Default
        </button>
      </div>
    </div>
  )
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0 gap-4">
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <div className="self-start sm:self-center">
        {children}
      </div>
    </div>
  )
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
    </button>
  )
}