import express from 'express';

import { login, logout } from '../controllers/authController.js';

const router = express.Router();
console.log('authRouter loaded');
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', async (req, res) => {
  // ⚠️ dočasné řešení – vždy vrací pseudo uživatele
  if (!req.user) {
    return res.json({
      id: 1,
      username: 'a',
    });
  }

  res.json(req.user);
});


export default router;
