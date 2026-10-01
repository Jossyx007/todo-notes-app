import React, { useEffect } from 'react'
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'
import type { ToastMessage } from '../types'

interface ToastProps {
  toast: ToastMessage | null
  onDismiss: () => void
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      onDismiss()
    }, 3200)
    return () => clearTimeout(timer)
  }, [toast, onDismiss])

  if (!toast) return null

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />,
  }

  const icon = icons[toast.type || 'success']

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-8 z-50 flex items-center gap-2.5 px-4 py-3 bg-white text-slate-800 text-sm font-medium rounded-xl shadow-lg border border-slate-200/80 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
    >
      {icon}
      <span>{toast.message}</span>
      <button
        onClick={onDismiss}
        className="ml-2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
