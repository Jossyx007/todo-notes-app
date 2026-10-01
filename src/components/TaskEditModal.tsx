import React, { useState, useEffect, useRef } from 'react'
import { X, Calendar, Flag, AlignLeft } from 'lucide-react'
import type { Task, Priority } from '../types'
import { todayIso } from '../utils/dates'

interface TaskEditModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'>>) => void
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority || 'medium')
      setDueDate(task.dueDate || '')
    }
  }, [task])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleInputRef.current?.focus(), 50)
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!task) return
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    onSave(task.id, {
      title: trimmedTitle,
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
    })
    onClose()
  }

  if (!isOpen || !task) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl border border-slate-200/80 transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <h3 id="edit-task-title" className="text-lg font-semibold text-slate-900">
            Edit Task
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-task-input" className="block text-xs font-semibold text-slate-600 mb-1">
              Title
            </label>
            <input
              id="edit-task-input"
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm sm:text-base text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-priority-select" className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-slate-400" />
                Priority
              </label>
              <select
                id="edit-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div>
              <label htmlFor="edit-duedate-input" className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Due Date
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="edit-duedate-input"
                  type="date"
                  value={dueDate}
                  min={todayIso()}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                />
                {dueDate && (
                  <button
                    type="button"
                    onClick={() => setDueDate('')}
                    className="text-xs text-slate-500 hover:text-slate-800 px-1 py-1"
                    title="Clear due date"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="edit-desc-input" className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              Description (optional)
            </label>
            <textarea
              id="edit-desc-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add extra details, instructions, or context..."
              className="w-full text-sm text-slate-700 bg-white border border-slate-200 rounded-xl p-3 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer min-h-[40px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-colors cursor-pointer shadow-xs min-h-[40px]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
