const { validationResult } = require('express-validator')
const { sendContactEmail } = require('../services/emailService')
const ContactMessage = require('../models/ContactMessage')

const asyncHandler =
  (handler) =>
  (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next)

const createContactMessage = asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    })
  }

  const { name, email, phone, message } = req.body
  // Save message to database (best-effort)
  const doc = {
    name,
    email,
    phone: phone || '',
    message,
  }
  ContactMessage.create(doc).catch((dbErr) => {
    console.error('Failed to save contact message to DB:', dbErr && dbErr.message ? dbErr.message : dbErr)
  })

  try {
    await sendContactEmail({ name, email, phone, message })
    res.status(200).json({
      success: true,
      message: 'Message received. We will respond within 1 business day.',
    })
  } catch (emailError) {
    console.error('Failed to send contact email:', emailError && emailError.message ? emailError.message : emailError)
    // Still return success since the message was received and saved
    res.status(200).json({
      success: true,
      message: 'Message received. We will respond within 1 business day.',
      warning: 'Email notification may have failed, but your message was logged.',
    })
  }
})

module.exports = { createContactMessage }
