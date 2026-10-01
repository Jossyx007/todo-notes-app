import React, { useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  taskMatchCount?: number
  noteMatchCount?: number
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  taskMatchCount,
  noteMatchCount,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut: pressing '/' focuses the search bar
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search tasks & notes... (Press '/' to focus)"
          aria-label="Search tasks and notes"
          className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 focus:border-indigo-400 rounded-xl pl-9 pr-9 py-2 transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
        />
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange('')
              inputRef.current?.focus()
            }}
            className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="hidden sm:inline-block absolute right-3 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md pointer-events-none">
            /
          </span>
        )}
      </div>

      {/* Match indicator pill */}
      {value.trim() && (
        <div className="absolute left-0 top-full mt-1.5 z-30 bg-white text-xs text-slate-600 px-3 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-2">
          <span>Found:</span>
          {taskMatchCount !== undefined && (
            <span className="font-semibold text-indigo-600">{taskMatchCount} tasks</span>
          )}
          {taskMatchCount !== undefined && noteMatchCount !== undefined && <span>•</span>}
          {noteMatchCount !== undefined && (
            <span className="font-semibold text-indigo-600">{noteMatchCount} notes</span>
          )}
        </div>
      )}
    </div>
  )
}
