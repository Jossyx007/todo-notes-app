import React, { useState } from 'react'
import {
  Check,
  Calendar,
  AlertCircle,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
} from 'lucide-react'
import type { Task, Priority } from '../types'
import { dueBadgeInfo } from '../utils/dates'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false)

  const dueInfo = task.dueDate ? dueBadgeInfo(task.dueDate) : null

  const priorityStyles: Record<Priority, { label: string; badge: string }> = {
    high: {
      label: 'High',
      badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
    },
    medium: {
      label: 'Medium',
      badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
    },
    low: {
      label: 'Low',
      badge: 'bg-slate-100 text-slate-600 border-slate-200/80',
    },
  }

  const priorityConfig = priorityStyles[task.priority || 'medium']

  return (
    <div
      className={`group relative flex flex-col p-3.5 sm:p-4 rounded-xl border transition-all duration-200 bg-white ${
        task.completed
          ? 'border-slate-200/60 bg-slate-50/50 opacity-70'
          : dueInfo?.status === -1
          ? 'border-rose-200 bg-rose-50/20 shadow-xs'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Custom Accessible Checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={task.completed}
          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'completed'}`}
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 border ${
            task.completed
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-slate-300 hover:border-indigo-500 bg-white'
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <span
              onClick={() => onToggle(task.id)}
              className={`text-sm sm:text-base font-medium break-words cursor-pointer select-none transition-all ${
                task.completed
                  ? 'line-through text-slate-400'
                  : 'text-slate-800 hover:text-indigo-600'
              }`}
            >
              {task.title}
            </span>
          </div>

          {/* Badges / Meta row */}
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            {/* Priority Tag */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${priorityConfig.badge}`}
            >
              {priorityConfig.label}
            </span>

            {/* Due Date Badge */}
            {dueInfo && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
                  task.completed
                    ? 'bg-slate-100 text-slate-500 border-slate-200'
                    : dueInfo.status === -1
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : dueInfo.status === 0
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {dueInfo.status === -1 ? (
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                ) : (
                  <Calendar className="w-3 h-3 text-slate-400" />
                )}
                <span>{dueInfo.label}</span>
              </span>
            )}

            {/* Description toggle indicator */}
            {task.description && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-0.5 text-xs text-slate-500 hover:text-slate-700 font-normal ml-1"
                aria-label={expanded ? 'Hide description' : 'Show description'}
              >
                <span>{expanded ? 'Hide details' : 'Details'}</span>
                {expanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}

            {task.completed && task.completedAt && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 ml-auto">
                <Clock className="w-3 h-3" />
                Completed
              </span>
            )}
          </div>

          {/* Expandable Description */}
          {task.description && expanded && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 text-xs sm:text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
              {task.description}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-0.5 ml-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            aria-label={`Edit task "${task.title}"`}
            title="Edit task"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            aria-label={`Delete task "${task.title}"`}
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
