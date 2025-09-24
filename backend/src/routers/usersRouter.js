// src/routers/usersRouter.js
const express = require('express')
const controller = require('../controllers/usersController.js')

const router = express.Router()

router.get('/me', controller.getMe)


module.exports = router
