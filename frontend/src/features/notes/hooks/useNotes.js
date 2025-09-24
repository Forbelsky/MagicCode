import { useCallback } from 'react'
import { useLocalStorage } from '../../../hooks/useLocalStorage.js'
import { generateId } from '../../../utils/generateId.js'

/**
 * Simple notes state backed by localStorage.
 * Exposes notes list and basic CRUD helpers.
 */
export function useNotes() {
  const [notes, setNotes] = useLocalStorage('notes', [])

  const addNote = useCallback((title, content) => {
    const trimmedTitle = title?.trim() ?? ''
    const trimmedContent = content?.trim() ?? ''
    if (!trimmedTitle && !trimmedContent) return

    const newNote = {
      id: generateId(),
      title: trimmedTitle || 'Untitled',
      content: trimmedContent,
      createdAt: new Date().toISOString(),
    }
    setNotes(prev => [newNote, ...prev])
  }, [setNotes])

  const removeNote = useCallback((id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }, [setNotes])

  const clearNotes = useCallback(() => {
    setNotes([])
  }, [setNotes])

  return {
    notes,
    addNote,
    removeNote,
    clearNotes,
  }
}
