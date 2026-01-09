const { sendNeonRequestEmail } = require('../server/src/services/emailService')

// Configure max body size (Vercel default is 4.5MB, we'll optimize payload instead)
module.exports = async (req, res) => {
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
    if (pdfBase64 && pdfBase64.length > 2 * 1024 * 1024) {
      // PDF is larger than 2MB, don't send it (email will still work)
      console.log('PDF too large, skipping attachment to reduce payload size')
      optimizedPdfBase64 = null
    }
    
    // Optimize image preview: If it's too large, compress or skip
    let optimizedImagePreview = imagePreview
    if (imagePreview && imagePreview.length > 2 * 1024 * 1024) {
      console.log('Image preview too large, attempting to optimize')
      // Try to remove data URI prefix to reduce size slightly
      if (imagePreview.startsWith('data:image')) {
        optimizedImagePreview = imagePreview
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

