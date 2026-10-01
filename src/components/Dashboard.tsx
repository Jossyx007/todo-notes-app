import React from 'react'
import {
  CheckCircle2,
  Clock,
  ListTodo,
  FileText,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import type { Task, Note, ActiveView } from '../types'
import { formatGreeting, formatCurrentDate, dueStatus } from '../utils/dates'
import { TaskForm } from './TaskForm'
import { TaskItem } from './TaskItem'
import { NoteCard } from './NoteCard'

interface DashboardProps {
  tasks: Task[]
  notes: Note[]
  onNavigate: (view: ActiveView) => void
  onAddTask: (title: string, description?: string, priority?: any, dueDate?: string) => void
  onToggleTask: (id: string) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onEditNote: (note: Note) => void
  onDeleteNote: (id: string) => void
}

export const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  notes,
  onNavigate,
  onAddTask,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onEditNote,
  onDeleteNote,
}) => {
  const greeting = formatGreeting()
  const currentDate = formatCurrentDate()

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const pendingTasks = totalTasks - completedTasks
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Urgent/Due today or Overdue tasks
  const urgentTasks = tasks
    .filter((t) => !t.completed)
    .filter((t) => {
      const s = dueStatus(t.dueDate)
      return s === -1 || s === 0 || t.priority === 'high'
    })
    .slice(0, 4)

  // Recent notes (last 2 created/updated)
  const recentNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 2)

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              {currentDate}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              {greeting}! Ready to organize?
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All data saved locally</span>
          </div>
        </div>

        {/* Compact Progress Bar */}
        <div className="mt-5 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-1.5">
            <span className="text-slate-600 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Task Progress
            </span>
            <span className="text-slate-800 font-semibold">{completionPercentage}% Completed</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
            <span>
              {completedTasks} of {totalTasks} tasks finished
            </span>
            <span>
              {pendingTasks === 0 && totalTasks > 0
                ? 'All tasks completed! 🌟'
                : `${pendingTasks} remaining`}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Tasks */}
        <div
          onClick={() => onNavigate('tasks')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-indigo-200 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Total Tasks</span>
            <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-indigo-50 text-slate-500 group-hover:text-indigo-600 transition-colors">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalTasks}</div>
          <div className="text-[11px] text-slate-400 mt-1">All created items</div>
        </div>

        {/* Pending Tasks */}
        <div
          onClick={() => onNavigate('tasks')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-amber-200 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Pending Tasks</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700">{pendingTasks}</div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting completion</div>
        </div>

        {/* Completed Tasks */}
        <div
          onClick={() => onNavigate('completed')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-emerald-200 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Completed</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700">{completedTasks}</div>
          <div className="text-[11px] text-slate-400 mt-1">Accomplished goals</div>
        </div>

        {/* Total Notes */}
        <div
          onClick={() => onNavigate('notes')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-indigo-200 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">My Notes</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-700">{notes.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Saved memos & ideas</div>
        </div>
      </div>

      {/* Quick Add Form on Dashboard */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 pl-1">
          Quick Capture
        </div>
        <TaskForm onAdd={onAddTask} />
      </div>

      {/* Two Column Layout: Urgent Tasks & Recent Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent / Due Focus */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm sm:text-base font-semibold text-slate-800">
                Priority &amp; Upcoming
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('tasks')}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {urgentTasks.length === 0 ? (
            <p className="text-xs sm:text-sm text-slate-400 py-6 text-center italic">
              No urgent or high-priority tasks pending right now.
            </p>
          ) : (
            <div className="space-y-2.5">
              {urgentTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggleTask}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Notes Preview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm sm:text-base font-semibold text-slate-800">Recent Notes</h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('notes')}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentNotes.length === 0 ? (
            <p className="text-xs sm:text-sm text-slate-400 py-6 text-center italic">
              No notes saved yet. Click below to write your first note.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={onEditNote}
                  onDelete={onDeleteNote}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
