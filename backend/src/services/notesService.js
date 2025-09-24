// src/services/notesService.js
const repo = require('../repositories/notesRepository.js')

async function listNotes() {
  return repo.list()
}

async function getNote(id) {
  return repo.findById(id)
}

async function createNote(data) {
  if (!data || (!data.title && !data.html)) {
    const err = new Error('Nothing to create')
    err.status = 400
    throw err
  }
  return repo.create(data)
}

async function updateNote(id, patch) {
  if (!patch || (!patch.title && !patch.html)) {
    const err = new Error('Nothing to update')
    err.status = 400
    throw err
  }
  const updated = repo.update(id, patch)
  if (!updated) {
    const err = new Error('Note not found')
    err.status = 404
    throw err
  }
  return updated
}

async function deleteNote(id) {
  const ok = repo.remove(id)
  if (!ok) {
    const err = new Error('Note not found')
    err.status = 404
    throw err
  }
  return { ok: true }
}

module.exports = {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
}
