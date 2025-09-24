/**
 * useNotes.js
 * Správa seznamu poznámek a aktuálně otevřené poznámky na klientu.
 * - Poskytuje funkce loadNotes, openNote, createNote, saveCurrent, deleteNote.
 * - Ukládá naposledy otevřenou poznámku do localStorage (klíč 'lastNoteId').
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchNotes, getNote, saveNote, updateNote, removeNote } from '../services/notesService.js'
import { useLocalStorage } from './useLocalStorage.js'

const LAST_NOTE_KEY = 'lastNoteId'

export function useNotes(options = { autoLoad: true }) {
  const [notes, setNotes] = useState([])
  const [currentNote, setCurrentNote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastNoteId, setLastNoteId] = useLocalStorage(LAST_NOTE_KEY, null)

  const loadNotes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await fetchNotes()
      setNotes(Array.isArray(list) ? list : [])
      return list
    } catch (e) {
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const openNote = useCallback(async (id) => {
    if (!id) return null
    setLoading(true)
    setError(null)
    try {
      const data = await getNote(id)
      setCurrentNote(data)
      setLastNoteId(id)
      return data
    } catch (e) {
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }, [setLastNoteId])

  const createNote = useCallback(async (note) => {
    setLoading(true)
    setError(null)
    try {
      const created = await saveNote(note)
      setNotes((prev) => [created, ...prev])
      setCurrentNote(created)
      setLastNoteId(created?.id ?? null)
      return created
    } catch (e) {
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }, [setLastNoteId])

  const saveCurrent = useCallback(async (patch) => {
    if (!currentNote?.id) {
      // pokud ještě nemá ID, vytvoř novou
      return createNote({ ...currentNote, ...patch })
    }
    setLoading(true)
    setError(null)
    try {
      const updated = await updateNote(currentNote.id, patch)
      setCurrentNote(updated)
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
      return updated
    } catch (e) {
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }, [currentNote, createNote])

  const deleteNote = useCallback(async (id) => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      await removeNote(id)
      setNotes((prev) => prev.filter((n) => n.id !== id))
      if (currentNote?.id === id) {
        setCurrentNote(null)
        setLastNoteId(null)
      }
    } catch (e) {
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }, [currentNote, setLastNoteId])

  // Automatické načtení seznamu na startu
  useEffect(() => {
    if (options?.autoLoad) {
      loadNotes().then(() => {
        if (lastNoteId) {
          openNote(lastNoteId).catch(() => {})
        }
      }).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // mount only

  return useMemo(() => ({
    notes,
    currentNote,
    setCurrentNote,
    loading,
    error,
    loadNotes,
    openNote,
    createNote,
    saveCurrent,
    deleteNote,
    lastNoteId,
    setLastNoteId,
  }), [notes, currentNote, loading, error, loadNotes, openNote, createNote, saveCurrent, deleteNote, lastNoteId])
}
