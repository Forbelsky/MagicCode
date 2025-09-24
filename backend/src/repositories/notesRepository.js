// src/repositories/notesRepository.js

// In-memory seznam poznámek
const notes = []

function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function list() {
  return [...notes]
}

function findById(id) {
  return notes.find((n) => n.id === id) || null
}

function create(note) {
  const n = { id: genId(), title: note.title || 'Untitled', html: note.html || '', ...note }
  notes.unshift(n)
  return n
}

function update(id, patch) {
  const idx = notes.findIndex((n) => n.id === id)
  if (idx === -1) return null
  notes[idx] = { ...notes[idx], ...patch, id }
  return notes[idx]
}

function remove(id) {
  const idx = notes.findIndex((n) => n.id === id)
  if (idx === -1) return false
  notes.splice(idx, 1)
  return true
}

module.exports = {
  list,
  findById,
  create,
  update,
  remove,
}
