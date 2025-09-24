// src/controllers/notesController.js
const svc = require('../services/notesService.js')

async function list(req, res) {
  const data = await svc.listNotes()
  res.json(data)
}

async function getOne(req, res) {
  const note = await svc.getNote(req.params.id)
  if (!note) return res.status(404).json({ error: 'Note not found' })
  res.json(note)
}

async function create(req, res) {
  try {
    const created = await svc.createNote(req.body || {})
    res.status(201).json(created)
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Create failed' })
  }
}

async function update(req, res) {
  try {
    const updated = await svc.updateNote(req.params.id, req.body || {})
    res.json(updated)
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Update failed' })
  }
}

async function remove(req, res) {
  try {
    const result = await svc.deleteNote(req.params.id)
    res.json(result)
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Delete failed' })
  }
}

module.exports = {
  list,
  getOne,
  create,
  update,
  remove,
}
