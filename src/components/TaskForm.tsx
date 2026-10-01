import React, { useState } from 'react'
import { Plus, Calendar, Flag, AlignLeft, X } from 'lucide-react'
import type { Priority } from '../types'
import { todayIso } from '../utils/dates'

interface TaskFormProps {
  onAdd: (title: string, description?: string, priority?: Priority, dueDate?: string) => void
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    onAdd(trimmedTitle, description.trim() || undefined, priority, dueDate || undefined)

    // Reset form
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setShowDetails(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs transition-all duration-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100"
    >
      {/* Primary Input Row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task... Press Enter to create"
          aria-label="New task title"
          className="flex-1 bg-transparent border-0 px-2 py-1.5 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-0"
        />

        <button
          type="submit"
          disabled={!title.trim()}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 rounded-xl transition-all cursor-pointer flex-shrink-0 shadow-xs min-h-[40px]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>

      {/* Expandable Options Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 mt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Selector */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Flag className="w-3.5 h-3.5" />
            </span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              aria-label="Task priority"
              className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          {/* Due Date Input */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            <input
              type="date"
              value={dueDate}
              min={todayIso()}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Due date"
              className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
            />
            {dueDate && (
              <button
                type="button"
                onClick={() => setDueDate('')}
                className="text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear date"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Toggle Description Field */}
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              showDetails || description
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'text-slate-500 bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>{showDetails ? 'Description' : '+ Description'}</span>
          </button>
        </div>
      </div>

      {/* Optional Description Textarea */}
      {showDetails && (
        <div className="mt-3 pt-2 border-t border-slate-100">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add an optional description or extra details..."
            rows={2}
            className="w-full text-xs sm:text-sm text-slate-700 bg-slate-50/60 border border-slate-200 rounded-xl p-2.5 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white resize-y"
          />
        </div>
      )}
    </form>
  )
}
