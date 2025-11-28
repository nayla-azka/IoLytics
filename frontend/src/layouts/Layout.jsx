// Layout.jsx

import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Cpu, BarChart3, ScrollText, Settings, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Follow system theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const root = document.documentElement
    
    const applyTheme = (e) => {
      root.classList.toggle('dark', e.matches)
      root.style.colorScheme = e.matches ? 'dark' : 'light'
    }

    // Apply initial system theme
    applyTheme(mediaQuery)

    // Listen for system theme changes
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', applyTheme)
      return () => mediaQuery.removeEventListener('change', applyTheme)
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(applyTheme)
      return () => mediaQuery.removeListener(applyTheme)
    }
  }, [])

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/devices', label: 'Devices', icon: Cpu },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/logs', label: 'Logs', icon: ScrollText },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-primary-600 dark:text-primary-400">IoT Dashboard</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            IoT Dashboard
          </h1>
        </div>
        
        <nav className="px-4 space-y-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Desktop Header */}
        <header className="hidden md:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Welcome Back</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor your IoT devices in real-time
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}