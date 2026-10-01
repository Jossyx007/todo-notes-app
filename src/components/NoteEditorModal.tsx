import React, { useState, useEffect, useRef } from 'react'
import { X, Calendar, Clock, Check } from 'lucide-react'
import type { Note } from '../types'
import { formatDateTime } from '../utils/dates'

interface NoteEditorModalProps {
  note: Note | null // null means creating a new note
  isOpen: boolean
  onClose: () => void
  onSave: (title: string, content: string) => void
}

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  note,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [note, isOpen])

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

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedTitle && !trimmedContent) {
      onClose()
      return
    }

    onSave(trimmedTitle || 'Untitled Note', trimmedContent)
    onClose()
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-dialog-title"
        className="w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-200/80 transition-all duration-200 scale-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <h3 id="note-dialog-title" className="text-lg font-semibold text-slate-900">
            {note ? 'Edit Note' : 'Create New Note'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close note editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Note Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* Title Input */}
          <div className="mb-3">
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              aria-label="Note title"
              className="w-full text-base sm:text-lg font-semibold text-slate-800 placeholder-slate-400 bg-transparent border-0 px-1 py-1 focus:outline-hidden"
            />
          </div>

          {/* Content Textarea */}
          <div className="flex-1 min-h-[220px] mb-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note thoughts, ideas, or lists here..."
              aria-label="Note content"
              rows={10}
              className="w-full h-full text-sm sm:text-base text-slate-700 placeholder-slate-400 bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 focus:outline-hidden focus:border-indigo-500 focus:bg-white resize-none leading-relaxed"
            />
          </div>

          {/* Word counts and meta */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pb-4">
            <div className="flex items-center gap-3">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} characters</span>
            </div>

            {note && (
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1" title="Created date">
                  <Calendar className="w-3 h-3" />
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1" title="Last updated">
                  <Clock className="w-3 h-3" />
                  {formatDateTime(note.updatedAt)}
                </span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
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
              disabled={!title.trim() && !content.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-colors cursor-pointer shadow-xs min-h-[40px]"
            >
              <Check className="w-4 h-4" />
              <span>{note ? 'Save Changes' : 'Create Note'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
