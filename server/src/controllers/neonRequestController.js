const { sendNeonRequestEmail } = require('../services/emailService')
const NeonRequest = require('../models/NeonRequest')

const asyncHandler =
  (handler) =>
  (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next)

const createNeonRequest = asyncHandler(async (req, res) => {
  const { customerName, email, phone, config, imagePreview, notes, timestamp, pdfBase64 } = req.body

  if (!customerName || !email || !config) {
    res.status(400)
    throw new Error('Missing required fields: customerName, email, and config are required')
  }

  const request = {
    customerName,
    email,
    phone: phone || '',
    config,
    imagePreview,
    notes: notes || '',
    timestamp: timestamp || new Date().toISOString(),
    pdfBase64,
  }

  try {
    // Persist request to database (best-effort, do not block email delivery)
    const doc = {
      createdBy: req.user?.id || req.user?._id || undefined,
      customerName: request.customerName,
      email: request.email,
      phone: request.phone,
      imagePreview: request.imagePreview,
      pdfBase64: request.pdfBase64 || undefined,
      notes: request.notes,
      status: 'new',
    }

    if (config) {
      if (config.category === 'name') {
        doc.text = config.text
        doc.font = config.font
        doc.color = config.color
        doc.size = config.size
      } else if (config.category === 'logo') {
        doc.text = config.text || ''
        doc.color = config.color
        doc.size = config.size
      } else if (config.category === 'default') {
        doc.text = config.template || ''
        doc.color = config.color
        doc.size = config.size
      }
      if (typeof config.price === 'number') doc.price = config.price
    }

    NeonRequest.create(doc).catch((dbErr) => {
      console.error('Failed to save neon request to DB:', dbErr && dbErr.message ? dbErr.message : dbErr)
    })

    // Attempt to send notification email
    try {
      await sendNeonRequestEmail(request)
      res.status(200).json({
        success: true,
        message: 'Design request sent successfully. A designer will contact you within 1 business day.',
      })
    } catch (emailError) {
      const errorMessage = emailError && emailError.message ? emailError.message : 'Unknown error'
      console.error('Failed to send neon request email:', errorMessage)

      if (errorMessage.includes('not configured') || errorMessage.includes('SMTP')) {
        res.status(200).json({
          success: true,
          message: 'Design request received. A designer will contact you within 1 business day.',
          warning: 'Email notification is not configured. Please check your SMTP settings.',
        })
      } else {
        res.status(200).json({
          success: true,
          message: 'Design request received. A designer will contact you within 1 business day.',
          warning: 'Email notification may have failed, but your request was logged.',
        })
      }
    }
  } catch (err) {
    console.error('Unexpected error handling neon request:', err)
    res.status(500)
    throw err
  }
})

module.exports = { createNeonRequest }
