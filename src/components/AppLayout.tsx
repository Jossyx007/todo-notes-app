import React from 'react'
import { Sparkles, Plus } from 'lucide-react'
import type { ActiveView } from '../types'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { SearchBar } from './SearchBar'

interface AppLayoutProps {
  activeView: ActiveView
  onNavigate: (view: ActiveView) => void
  pendingTaskCount: number
  totalNotesCount: number
  completedTaskCount: number
  searchQuery: string
  onSearchChange: (query: string) => void
  taskMatchCount?: number
  noteMatchCount?: number
  onQuickNewTask?: () => void
  onQuickNewNote?: () => void
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeView,
  onNavigate,
  pendingTaskCount,
  totalNotesCount,
  completedTaskCount,
  searchQuery,
  onSearchChange,
  taskMatchCount,
  noteMatchCount,
  onQuickNewTask,
  onQuickNewNote,
  children,
}) => {
  const titles: Record<ActiveView, string> = {
    dashboard: 'Dashboard',
    tasks: 'My Tasks',
    notes: 'My Notes',
    completed: 'Completed Tasks',
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* Desktop Sidebar */}
      <Sidebar
        activeView={activeView}
        onNavigate={onNavigate}
        pendingTaskCount={pendingTaskCount}
        totalNotesCount={totalNotesCount}
        completedTaskCount={completedTaskCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-base">TaskFlow</span>
          </div>

          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-slate-900">{titles[activeView]}</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-auto sm:mx-0">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              taskMatchCount={taskMatchCount}
              noteMatchCount={noteMatchCount}
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {activeView === 'notes' ? (
              <button
                type="button"
                onClick={onQuickNewNote}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer shadow-xs min-h-[36px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Note</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onQuickNewTask}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer shadow-xs min-h-[36px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Task</span>
              </button>
            )}
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 pb-24 md:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeView={activeView}
        onNavigate={onNavigate}
        pendingTaskCount={pendingTaskCount}
        totalNotesCount={totalNotesCount}
        completedTaskCount={completedTaskCount}
      />
    </div>
  )
}
