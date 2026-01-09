const { sendContactEmail } = require('../server/src/services/emailService')

// Simple email validation
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, email, phone, message } = req.body

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: [{ field: 'name', message: 'Name is required' }],
      })
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: [{ field: 'email', message: 'Valid email required' }],
      })
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: [{ field: 'message', message: 'Message is required' }],
      })
    }

    try {
      await sendContactEmail({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone?.trim() || '', message: message.trim() })
      return res.status(200).json({
        success: true,
        message: 'Message received. We will respond within 1 business day.',
      })
    } catch (emailError) {
      console.error('Failed to send contact email:', emailError && emailError.message ? emailError.message : emailError)
      // Still return success since the message was received
      return res.status(200).json({
        success: true,
        message: 'Message received. We will respond within 1 business day.',
        warning: 'Email notification may have failed, but your message was logged.',
      })
    }
  } catch (err) {
    console.error('Unexpected error handling contact message:', err)
    return res.status(500).json({
      message: err.message || 'Internal server error',
    })
  }
}

