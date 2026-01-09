// Contact endpoint - use Express app
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { body } = require('express-validator')
const { createContactMessage } = require('../server/src/controllers/contactController')

const router = express.Router()
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('phone').optional().trim(),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  createContactMessage,
)

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/', router)

module.exports = app

