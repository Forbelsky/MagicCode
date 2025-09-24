/**
 * notesService.js
 * Funkce pro práci s poznámkami.
 * Konvence endpointů (přizpůsob dle backendu):
 *  - GET    /notes             -> [{ id, title, html, ... }]
 *  - GET    /notes/:id         -> { id, title, html, ... }
 *  - POST   /notes             -> { id, ...note }
 *  - PUT    /notes/:id         -> { ...updatedNote }
 *  - DELETE /notes/:id         -> { ok: true }
 */
import { get, post, put, del } from './apiClient.js'

export function fetchNotes() {
  return get('/notes')
}

export function getNote(id) {
  return get(`/notes/${encodeURIComponent(id)}`)
}

export function saveNote(note) {
  // očekává { title?, subject?, topic?, html? ... }
  return post('/notes', note)
}

export function updateNote(id, patch) {
  return put(`/notes/${encodeURIComponent(id)}`, patch)
}

export function removeNote(id) {
  return del(`/notes/${encodeURIComponent(id)}`)
}
