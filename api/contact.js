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
    // Log the incoming request for debugging
    console.log('📨 Contact form request received')
    console.log('Request method:', req.method)
    console.log('Request headers:', JSON.stringify(req.headers))
    console.log('Request body:', JSON.stringify(req.body))

    const { name, email, phone, message } = req.body || {}

    // Validation
    if (!name || !name.trim()) {
      console.log('❌ Validation failed: Name is required')
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'name', message: 'Name is required' }],
      })
    }

    if (!email || !isValidEmail(email)) {
      console.log('❌ Validation failed: Valid email required')
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'email', message: 'Valid email required' }],
      })
    }

    if (!message || !message.trim()) {
      console.log('❌ Validation failed: Message is required')
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'message', message: 'Message is required' }],
      })
    }

    console.log('✅ Validation passed')

    try {
      console.log('📧 Sending contact email...')
      console.log('Environment check:', {
        DESIGNER_EMAIL: process.env.DESIGNER_EMAIL ? 'SET' : 'MISSING',
        SMTP_USER: process.env.SMTP_USER ? 'SET' : 'MISSING',
        SMTP_PASS: process.env.SMTP_PASS ? 'SET' : 'MISSING',
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? 'SET' : 'MISSING',
      })
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
      const errorCode = emailError && emailError.code ? emailError.code : 'UNKNOWN'
      console.error('❌ Failed to send contact email:', errorMessage)
      console.error('Error code:', errorCode)
      console.error('Full error:', emailError)
      
      // Return success to user but log the error
      return res.status(200).json({
        success: true,
        message: 'Message received. We will respond within 1 business day.',
        warning: errorMessage.includes('not configured') 
          ? 'Email notification is not configured. Please check your SMTP/SendGrid settings in Vercel environment variables.'
          : `Email notification failed (${errorCode}). Please check Vercel logs for details.`,
        emailSent: false,
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      })
    }
  } catch (err) {
    console.error('❌ Unexpected error handling contact message:', err)
    console.error('Error name:', err?.name)
    console.error('Error message:', err?.message)
    console.error('Error stack:', err?.stack)
    return res.status(500).json({
      success: false,
      message: err?.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err?.stack : undefined,
    })
  }
}

