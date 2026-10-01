import React, { useState, useMemo } from 'react'
import {
  ListFilter,
  ArrowUpDown,
  CheckCircle2,
  Trash2,
} from 'lucide-react'
import type { Task, TaskFilter, TaskSort } from '../types'
import { dueStatus } from '../utils/dates'
import { TaskItem } from './TaskItem'
import { EmptyState } from './EmptyState'

interface TaskListProps {
  tasks: Task[]
  filter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onClearCompleted?: () => void
  searchQuery?: string
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  onFilterChange,
  onToggle,
  onEdit,
  onDelete,
  onClearCompleted,
  searchQuery = '',
}) => {
  const [sort, setSort] = useState<TaskSort>('dueDate')

  // Filter tasks based on status and search query
  const filteredTasks = useMemo(() => {
    let result = tasks

    // 1. Filter by status
    if (filter === 'pending') {
      result = result.filter((t) => !t.completed)
    } else if (filter === 'completed') {
      result = result.filter((t) => t.completed)
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)),
      )
    }

    // 3. Sort tasks
    return [...result].sort((a, b) => {
      // Completed items go to the bottom unless viewing completed tab
      if (filter !== 'completed' && a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }

      if (sort === 'dueDate') {
        const statusA = dueStatus(a.dueDate)
        const statusB = dueStatus(b.dueDate)

        // Overdue (-1) -> Today (0) -> Upcoming (1) -> No Date (null)
        const weight = (s: -1 | 0 | 1 | null) => (s === null ? 3 : s + 1)
        const diff = weight(statusA) - weight(statusB)
        if (diff !== 0) return diff

        if (a.dueDate && b.dueDate) {
          const comp = a.dueDate.localeCompare(b.dueDate)
          if (comp !== 0) return comp
        }
        return b.createdAt - a.createdAt
      }

      if (sort === 'priority') {
        const priorityWeight = { high: 0, medium: 1, low: 2 }
        const pA = priorityWeight[a.priority || 'medium']
        const pB = priorityWeight[b.priority || 'medium']
        if (pA !== pB) return pA - pB
        return b.createdAt - a.createdAt
      }

      // Default: sort by createdAt (newest first)
      return b.createdAt - a.createdAt
    })
  }, [tasks, filter, searchQuery, sort])

  const pendingCount = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <section className="space-y-4">
      {/* Controls Bar: Filters and Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('pending')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
              filter === 'pending'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('completed')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Sort Selector & Clear Completed */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as TaskSort)}
              aria-label="Sort tasks"
              className="bg-transparent text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="createdAt">Date Created</option>
            </select>
          </div>

          {filter === 'completed' && completedCount > 0 && onClearCompleted && (
            <button
              type="button"
              onClick={onClearCompleted}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200/80 transition-colors cursor-pointer"
              title="Delete all completed tasks"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Completed</span>
            </button>
          )}
        </div>
      </div>

      {/* Task List or Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
          <EmptyState
            icon={filter === 'completed' ? CheckCircle2 : ListFilter}
            title={
              searchQuery
                ? 'No matching tasks found'
                : filter === 'completed'
                ? 'No completed tasks yet'
                : filter === 'pending'
                ? 'All caught up! 🎉'
                : 'No tasks created yet'
            }
            description={
              searchQuery
                ? `No tasks match your search "${searchQuery}". Try different keywords.`
                : filter === 'completed'
                ? 'Completed tasks will be saved here so you can review what you achieved.'
                : filter === 'pending'
                ? 'You have completed all pending tasks! Take a break or add a new task.'
                : 'Add a new task using the input above to begin organizing your day.'
            }
          />
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}
