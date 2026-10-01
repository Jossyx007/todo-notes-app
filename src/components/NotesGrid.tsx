import React, { useMemo } from 'react'
import { Plus, FileText, Search } from 'lucide-react'
import type { Note } from '../types'
import { NoteCard } from './NoteCard'
import { EmptyState } from './EmptyState'

interface NotesGridProps {
  notes: Note[]
  onNewNote: () => void
  onEditNote: (note: Note) => void
  onDeleteNote: (id: string) => void
  searchQuery?: string
}

export const NotesGrid: React.FC<NotesGridProps> = ({
  notes,
  onNewNote,
  onEditNote,
  onDeleteNote,
  searchQuery = '',
}) => {
  const filteredNotes = useMemo(() => {
    let result = notes
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q),
      )
    }
    // Sort by recently updated
    return [...result].sort((a, b) => b.updatedAt - a.updatedAt)
  }, [notes, searchQuery])

  return (
    <section className="space-y-5">
      {/* Notes Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-800">
            My Notes ({filteredNotes.length})
          </h2>
          <p className="text-xs text-slate-500">
            Capture thoughts, ideas, and drafts with instant local saving.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewNote}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all cursor-pointer shadow-xs min-h-[40px]"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Grid or Empty State */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
          <EmptyState
            icon={searchQuery ? Search : FileText}
            title={searchQuery ? 'No matching notes found' : 'No notes yet'}
            description={
              searchQuery
                ? `No notes match "${searchQuery}". Check for typos or try searching a different term.`
                : 'Keep your thoughts organized. Create your first note for quick ideas, meeting memos, or checklists.'
            }
            actionLabel={searchQuery ? undefined : 'Create a Note'}
            onAction={searchQuery ? undefined : onNewNote}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={onEditNote}
              onDelete={onDeleteNote}
            />
          ))}
        </div>
      )}
    </section>
  )
}
