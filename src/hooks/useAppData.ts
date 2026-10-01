import { useEffect, useState } from 'react'
import { loadData, saveData } from '../storage'
import type { AppData, Task, Note, Priority } from '../types'

function makeId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'id_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
}

export function useAppData() {
  const [data, setData] = useState<AppData>(loadData)

  useEffect(() => {
    saveData(data)
  }, [data])

  // --- Task Operations ---

  function addTask(
    title: string,
    description: string = '',
    priority: Priority = 'medium',
    dueDate?: string,
  ): Task {
    const newTask: Task = {
      id: makeId(),
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
      completed: false,
      createdAt: Date.now(),
    }

    setData((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }))

    return newTask
  }

  function editTask(
    id: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'>>,
  ): void {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => {
        if (task.id !== id) return task
        return {
          ...task,
          ...updates,
          title: updates.title !== undefined ? updates.title.trim() : task.title,
          description:
            updates.description !== undefined ? updates.description.trim() || undefined : task.description,
        }
      }),
    }))
  }

  function toggleTask(id: string): void {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => {
        if (task.id !== id) return task
        const nextCompleted = !task.completed
        return {
          ...task,
          completed: nextCompleted,
          completedAt: nextCompleted ? Date.now() : undefined,
        }
      }),
    }))
  }

  function deleteTask(id: string): void {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }))
  }

  function clearCompletedTasks(): void {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => !t.completed),
    }))
  }

  // --- Note Operations ---

  function addNote(title: string, content: string): Note {
    const newNote: Note = {
      id: makeId(),
      title: title.trim(),
      content: content.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    setData((prev) => ({
      ...prev,
      notes: [newNote, ...prev.notes],
    }))

    return newNote
  }

  function editNote(id: string, title: string, content: string): void {
    setData((prev) => ({
      ...prev,
      notes: prev.notes.map((note) => {
        if (note.id !== id) return note
        return {
          ...note,
          title: title.trim(),
          content: content.trim(),
          updatedAt: Date.now(),
        }
      }),
    }))
  }

  function deleteNote(id: string): void {
    setData((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }))
  }

  return {
    data,
    addTask,
    editTask,
    toggleTask,
    deleteTask,
    clearCompletedTasks,
    addNote,
    editNote,
    deleteNote,
  }
}
