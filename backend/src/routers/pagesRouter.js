// src/routers/pagesRouter.js
const express = require('express')
const controller = require('../controllers/pagesController.js')

const router = express.Router()

router.get('/pages', controller.listPages)
router.get('/current', controller.getCurrent)
router.post('/current', controller.setCurrent)

module.exports = router
