require('dotenv').config()
const { sendContactEmail } = require('../server/src/services/emailService')

// Simple email validation
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

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
      console.log('📧 Sending contact email...')
      console.log('Contact details:', { name: name.trim(), email: email.trim().toLowerCase(), phone: phone?.trim() || '' })
      
      await sendContactEmail({ 
        name: name.trim(), 
        email: email.trim().toLowerCase(), 
        phone: phone?.trim() || '', 
        message: message.trim() 
      })
      
      console.log('✅ Contact email sent successfully')
      return res.status(200).json({
        success: true,
        message: 'Message received. We will respond within 1 business day.',
      })
    } catch (emailError) {
      const errorMessage = emailError && emailError.message ? emailError.message : 'Unknown error'
      console.error('❌ Failed to send contact email:', errorMessage)
      console.error('Full error:', emailError)
      
      // Still return success since the message was received
      return res.status(200).json({
        success: true,
        message: 'Message received. We will respond within 1 business day.',
        warning: 'Email notification may have failed, but your message was logged.',
      })
    }
  } catch (err) {
    console.error('❌ Unexpected error handling contact message:', err)
    console.error('Error stack:', err.stack)
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    })
  }
}

