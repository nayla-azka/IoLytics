import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useNotification } from '../context/NotificationContext'

export function ToastContainer() {
    const { notifications, removeNotification } = useNotification()

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {notifications.map((notification) => (
                <Toast
                    key={notification.id}
                    {...notification}
                    onClose={() => removeNotification(notification.id)}
                />
            ))}
        </div>
    )
}

function Toast({ type, message, duration, onClose }) {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(onClose, duration)
            return () => clearTimeout(timer)
        }
    }, [duration, onClose])

    const icons = {
        success: <CheckCircle size={20} className="text-green-500" />,
        error: <AlertCircle size={20} className="text-red-500" />,
        info: <Info size={20} className="text-blue-500" />,
        test: <Info size={20} className="text-purple-500" />,
    }

    const styles = {
        success: 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800',
        error: 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800',
        info: 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800',
        test: 'border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800',
    }

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right-full ${styles[type] || styles.info
                } min-w-[300px] max-w-md`}
        >
            {icons[type] || icons.info}
            <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                {message}
            </p>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
                <X size={16} />
            </button>
        </div>
    )
}
