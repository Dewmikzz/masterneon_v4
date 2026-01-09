// Neon request endpoint - use Express app
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createNeonRequest } = require('../server/src/controllers/neonRequestController')

const router = express.Router()
router.post('/', createNeonRequest)

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/', router)

module.exports = app

