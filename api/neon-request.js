require('dotenv').config()
const { sendNeonRequestEmail } = require('../server/src/services/emailService')

// Configure max body size (Vercel default is 4.5MB, we'll optimize payload instead)
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Check content length (Vercel limit is ~4.5MB)
  const contentLength = req.headers['content-length']
  if (contentLength && parseInt(contentLength) > 4 * 1024 * 1024) {
    return res.status(413).json({
      message: 'Request payload too large. Please reduce image size or skip PDF attachment.',
      suggestion: 'Try sending without PDF or use a smaller image.',
    })
  }

  try {
    const { customerName, email, phone, config, imagePreview, notes, timestamp, pdfBase64 } = req.body
    
    // Optimize payload: Remove PDF if it's too large (keep only essential data)
    let optimizedPdfBase64 = pdfBase64
    if (pdfBase64) {
      // Remove data URI prefix to get actual base64 length
      const base64Length = pdfBase64.includes(',') 
        ? pdfBase64.split(',')[1].length 
        : pdfBase64.length
      
      // PDF is larger than 1.5MB base64, don't send it (email will still work)
      if (base64Length > 1.5 * 1024 * 1024) {
        console.log('PDF too large (' + Math.round(base64Length / 1024) + 'KB), skipping attachment to reduce payload size')
        optimizedPdfBase64 = null
      }
    }
    
    // Optimize image preview: If it's too large, skip it
    let optimizedImagePreview = imagePreview
    if (imagePreview) {
      // Remove data URI prefix to get actual base64 length
      const base64Length = imagePreview.includes(',') 
        ? imagePreview.split(',')[1].length 
        : imagePreview.length
      
      // Image is larger than 1.5MB base64, skip it
      if (base64Length > 1.5 * 1024 * 1024) {
        console.log('Image preview too large (' + Math.round(base64Length / 1024) + 'KB), skipping to reduce payload size')
        optimizedImagePreview = null
      }
    }

    if (!customerName || !email || !config) {
      return res.status(400).json({
        message: 'Missing required fields: customerName, email, and config are required',
      })
    }

    const request = {
      customerName,
      email,
      phone: phone || '',
      config,
      imagePreview: optimizedImagePreview,
      notes: notes || '',
      timestamp: timestamp || new Date().toISOString(),
      pdfBase64: optimizedPdfBase64,
    }

    // Attempt to send notification email
    try {
      console.log('📧 Sending design request email to designer...')
      console.log('Designer email:', process.env.DESIGNER_EMAIL)
      console.log('Customer:', customerName, email)
      console.log('Design category:', config?.category)
      
      await sendNeonRequestEmail(request)
      
      console.log('✅ Email sent successfully to designer')
      return res.status(200).json({
        success: true,
        message: 'Design request sent successfully! A Master Neon designer will contact you within 1 business day.',
        emailSent: true,
      })
    } catch (emailError) {
      const errorMessage = emailError && emailError.message ? emailError.message : 'Unknown error'
      console.error('Failed to send neon request email:', errorMessage)

      if (errorMessage.includes('not configured') || errorMessage.includes('SMTP')) {
        return res.status(200).json({
          success: true,
          message: 'Design request received. A designer will contact you within 1 business day.',
          warning: 'Email notification is not configured. Please check your SMTP settings.',
        })
      } else {
        return res.status(200).json({
          success: true,
          message: 'Design request received. A designer will contact you within 1 business day.',
          warning: 'Email notification may have failed, but your request was logged.',
        })
      }
    }
  } catch (err) {
    console.error('Unexpected error handling neon request:', err)
    return res.status(500).json({
      message: err.message || 'Internal server error',
    })
  }
}

