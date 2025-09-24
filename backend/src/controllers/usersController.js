// src/controllers/usersController.js
const { getUserFromToken } = require('../services/authService.js')

function readTokenFromAuthHeader(req) {
  const auth = req.headers.authorization || ''
  const [scheme, token] = auth.split(' ')
  if (scheme && scheme.toLowerCase() === 'bearer' && token) return token
  return null
}

async function getMe(req, res) {
  const token = readTokenFromAuthHeader(req)
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  const user = await getUserFromToken(token)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })
  res.json(user)
}

module.exports = {
  getMe,
}
