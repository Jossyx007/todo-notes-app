import React from 'react'
import { LayoutDashboard, CheckSquare, FileText, CheckCircle2 } from 'lucide-react'
import type { ActiveView } from '../types'

interface MobileNavProps {
  activeView: ActiveView
  onNavigate: (view: ActiveView) => void
  pendingTaskCount: number
  totalNotesCount: number
  completedTaskCount: number
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeView,
  onNavigate,
  pendingTaskCount,
  totalNotesCount,
  completedTaskCount,
}) => {
  const items: {
    id: ActiveView
    label: string
    icon: React.ReactNode
    badge?: number
  }[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: pendingTaskCount,
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: <FileText className="w-5 h-5" />,
      badge: totalNotesCount,
    },
    {
      id: 'completed',
      label: 'Done',
      icon: <CheckCircle2 className="w-5 h-5" />,
      badge: completedTaskCount,
    },
  ]

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg"
    >
      {items.map((item) => {
        const isActive = activeView === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer min-h-[48px] min-w-[56px] ${
              isActive ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[16px] h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
