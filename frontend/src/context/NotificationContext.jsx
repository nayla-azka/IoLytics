import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const NotificationContext = createContext()

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem('notifications_enabled')
    return saved !== null ? JSON.parse(saved) : true
  })

  useEffect(() => {
    localStorage.setItem('notifications_enabled', JSON.stringify(enabled))
  }, [enabled])

  const addNotification = useCallback((type, message, duration = 3000) => {
    if (!enabled && type !== 'test') return

    const id = Date.now()
    setNotifications((prev) => [...prev, { id, type, message, duration }])
  }, [enabled])

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const toggleNotifications = useCallback((value) => {
    setEnabled(value)
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        enabled,
        toggleNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
