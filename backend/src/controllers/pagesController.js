// src/controllers/pagesController.js

// Jednoduché demo stránky, aby šlo ilustrovat routing a kontrolery
const pages = [
  { id: 'home', title: 'Domů', html: '<h2>Domů</h2><p>Vítejte v ukázce.</p>' },
  { id: 'about', title: 'O aplikaci', html: '<h2>O aplikaci</h2><p>Demonstrační server.</p>' },
  { id: 'notes', title: 'Poznámky', html: '<h2>Poznámky</h2><p>Prostor pro poznámky.</p>' },
]

let currentPageId = 'home'

async function listPages(_req, res) {
  res.json({ pages, current: currentPageId })
}

async function getCurrent(_req, res) {
  const page = pages.find((p) => p.id === currentPageId)
  res.json({ current: currentPageId, page })
}

async function setCurrent(req, res) {
  const { id } = req.body || {}
  const exists = pages.some((p) => p.id === id)
  if (!exists) {
    return res.status(400).json({ error: 'Unknown page id', allowed: pages.map((p) => p.id) })
  }
  currentPageId = id
  return res.json({ ok: true, current: currentPageId })
}

module.exports = {
  listPages,
  getCurrent,
  setCurrent,
}
