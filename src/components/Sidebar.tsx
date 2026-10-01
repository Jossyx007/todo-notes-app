import React from 'react'
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import type { ActiveView } from '../types'

interface SidebarProps {
  activeView: ActiveView
  onNavigate: (view: ActiveView) => void
  pendingTaskCount: number
  totalNotesCount: number
  completedTaskCount: number
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  pendingTaskCount,
  totalNotesCount,
  completedTaskCount,
}) => {
  const navItems: {
    id: ActiveView
    label: string
    icon: React.ReactNode
    badge?: number
    badgeColor?: string
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'tasks',
      label: 'My Tasks',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingTaskCount,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'notes',
      label: 'My Notes',
      icon: <FileText className="w-4 h-4" />,
      badge: totalNotesCount,
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: <CheckCircle2 className="w-4 h-4" />,
      badge: completedTaskCount,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
  ]

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 flex-shrink-0 h-screen sticky top-0 hidden md:flex">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-2.5 px-3 py-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 leading-tight">TaskFlow</div>
            <div className="text-[11px] text-slate-400">Tasks &amp; Notes</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Footer Storage Badge */}
      <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-700 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Private &amp; Offline</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-normal">
          Saved directly to your browser's LocalStorage. No server sync needed.
        </p>
      </div>
    </aside>
  )
}
