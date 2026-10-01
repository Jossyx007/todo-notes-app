import React from 'react'
import { Pencil, Trash2, Calendar, Clock } from 'lucide-react'
import type { Note } from '../types'
import { timeAgo, formatDateTime } from '../utils/dates'

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  return (
    <article
      onClick={() => onEdit(note)}
      className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 cursor-pointer min-h-[180px]"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {note.title || 'Untitled Note'}
          </h3>

          <div
            className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onEdit(note)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              aria-label={`Edit note "${note.title}"`}
              title="Edit note"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(note.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              aria-label={`Delete note "${note.title}"`}
              title="Delete note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-600 line-clamp-4 whitespace-pre-wrap leading-relaxed">
          {note.content || <span className="italic text-slate-400">Empty note</span>}
        </p>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-400">
        <span
          className="flex items-center gap-1"
          title={`Created: ${formatDateTime(note.createdAt)}`}
        >
          <Calendar className="w-3 h-3 text-slate-400" />
          {new Date(note.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </span>
        <span
          className="flex items-center gap-1"
          title={`Updated: ${formatDateTime(note.updatedAt)}`}
        >
          <Clock className="w-3 h-3 text-slate-400" />
          Updated {timeAgo(note.updatedAt)}
        </span>
      </footer>
    </article>
  )
}
