const express = require('express')
const { body } = require('express-validator')
const { createContactMessage } = require('../controllers/contactController')

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

module.exports = router
