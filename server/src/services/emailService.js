const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')

let sgMail
if (process.env.SENDGRID_API_KEY) {
  try {
    sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    console.log('Using SendGrid for transactional email (SENDGRID_API_KEY detected)')
  } catch (e) {
    console.warn('Could not load @sendgrid/mail even though SENDGRID_API_KEY is set:', e.message)
    sgMail = null
  }
}

const resolvedHost =
  process.env.SMTP_HOST ||
  (process.env.SMTP_USER && process.env.SMTP_USER.includes('@gmail.com') ? 'smtp.gmail.com' : undefined)

// Only create transporter if we have the required config (not using SendGrid exclusively)
let transporter = null
if (resolvedHost && process.env.SMTP_USER && process.env.SMTP_PASS) {
  try {
    transporter = nodemailer.createTransport({
      host: resolvedHost,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
    console.log('✅ SMTP transporter configured:', resolvedHost)
  } catch (e) {
    console.error('❌ Failed to create SMTP transporter:', e.message)
    transporter = null
  }
} else if (!sgMail) {
  console.warn('⚠️ No email transport configured (neither SendGrid nor SMTP)')
}

const isEmailConfigured = () => {
  // Check if SendGrid is configured
  if (sgMail && process.env.DESIGNER_EMAIL && !process.env.DESIGNER_EMAIL.includes('your_')) {
    return true
  }
  
  // Check if SMTP is configured
  if (
    transporter &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    !process.env.SMTP_USER.includes('your_') &&
    !process.env.SMTP_PASS.includes('your_') &&
    process.env.DESIGNER_EMAIL &&
    !process.env.DESIGNER_EMAIL.includes('your_')
  ) {
    return true
  }
  
  return false
}

const getEmailTemplate = (title, content, footerText = '© 2026 Master Neon. All rights reserved.') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #000000; font-family: 'Arial', sans-serif; color: #ffffff; }
    table { border-spacing: 0; width: 100%; max-width: 600px; margin: 0 auto; background-color: #111111; }
    td { padding: 0; }
    .header { background-color: #000000; padding: 30px 20px; text-align: center; border-bottom: 2px solid #ff00ff; }
    .header h1 { margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; }
    .header span { color: #ff00ff; }
    .content { padding: 40px 30px; }
    .card { background-color: #1a1a1a; border-radius: 8px; padding: 25px; margin-bottom: 25px; border: 1px solid #333333; }
    .card-title { color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 1px solid #333333; padding-bottom: 10px; }
    .field { margin-bottom: 12px; }
    .label { color: #aaaaaa; font-size: 13px; margin-right: 5px; }
    .value { color: #ffffff; font-size: 15px; font-weight: 500; }
    .accent { color: #00ffff; }
    .footer { padding: 30px 20px; text-align: center; font-size: 12px; color: #666666; background-color: #000000; }
    .btn { display: inline-block; padding: 12px 24px; background-color: #ff00ff; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 10px; }
    @media only screen and (max-width: 600px) {
      .content { padding: 20px; }
      .card { padding: 15px; }
    }
  </style>
</head>
<body>
  <table>
    <tr>
      <td class="header">
        <h1>Master<span>Neon</span></h1>
      </td>
    </tr>
    <tr>
      <td class="content">
        ${content}
      </td>
    </tr>
    <tr>
      <td class="footer">
        ${footerText}
      </td>
    </tr>
  </table>
</body>
</html>
`

const sendNeonRequestEmail = async (request) => {
  console.log('📧 sendNeonRequestEmail called')
  console.log('Email config check:', {
    hasSMTP_USER: !!process.env.SMTP_USER,
    hasSMTP_PASS: !!process.env.SMTP_PASS,
    hasDESIGNER_EMAIL: !!process.env.DESIGNER_EMAIL,
    hasSENDGRID_API_KEY: !!process.env.SENDGRID_API_KEY,
  })

  if (!isEmailConfigured()) {
    const errorMsg = 'Email not configured. Missing required environment variables: SMTP_USER, SMTP_PASS, or DESIGNER_EMAIL'
    console.error('❌', errorMsg)
    throw new Error(errorMsg)
  }

  const attachment = []
  
  console.log('📎 Processing attachments...')
  console.log('- Has imagePreview:', !!request.imagePreview)
  console.log('- Has pdfBase64:', !!request.pdfBase64)
  console.log('- Has invoicePdfBase64:', !!request.invoicePdfBase64)
  
  if (request.imagePreview && request.imagePreview.startsWith('data:image')) {
    attachment.push({
      filename: 'neon-preview.png',
      content: request.imagePreview.split(';base64,').pop(),
      encoding: 'base64',
    })
    console.log('✅ Added image preview attachment')
  }

  if (request.pdfBase64) {
    try {
      let pdfBase64 = typeof request.pdfBase64 === 'string' ? request.pdfBase64.trim() : null
      console.log('📄 Processing design PDF:', {
        exists: !!pdfBase64,
        length: pdfBase64 ? pdfBase64.length : 0,
        startsWithData: pdfBase64 ? pdfBase64.startsWith('data:') : false,
        firstChars: pdfBase64 ? pdfBase64.substring(0, 50) : '',
      })
      
      if (pdfBase64 && pdfBase64.length > 0) {
        // Remove data URI prefix if present, otherwise use as-is
        let cleanBase64 = pdfBase64
        if (pdfBase64.includes(',')) {
          // Has data URI prefix, extract base64 part
          cleanBase64 = pdfBase64.split(',')[1]
        } else if (pdfBase64.startsWith('data:')) {
          // Has data prefix but no comma (unlikely but handle it)
          cleanBase64 = pdfBase64.replace(/^data:[^;]*;base64,/, '')
        }
        // If no prefix, use the string as-is (it's already base64)
        
        if (cleanBase64 && cleanBase64.length > 0) {
          attachment.push({
            filename: 'design.pdf',
            content: cleanBase64,
            encoding: 'base64',
          })
          console.log('✅ Added design PDF attachment (' + Math.round(cleanBase64.length / 1024) + 'KB)')
        } else {
          console.log('⚠️ Design PDF base64 is empty after cleaning')
        }
      } else {
        console.log('⚠️ Design PDF is empty or invalid')
      }
    } catch (e) {
      console.error('❌ Error processing design PDF attachment:', e.message)
      console.error('Error stack:', e.stack)
    }
  } else {
    console.log('⚠️ No design PDF in request')
  }

  // Add invoice PDF attachment
  if (request.invoicePdfBase64) {
    try {
      let invoicePdfBase64 = typeof request.invoicePdfBase64 === 'string' ? request.invoicePdfBase64.trim() : null
      console.log('📄 Processing invoice PDF:', {
        exists: !!invoicePdfBase64,
        length: invoicePdfBase64 ? invoicePdfBase64.length : 0,
        startsWithData: invoicePdfBase64 ? invoicePdfBase64.startsWith('data:') : false,
        firstChars: invoicePdfBase64 ? invoicePdfBase64.substring(0, 50) : '',
      })
      
      if (invoicePdfBase64 && invoicePdfBase64.length > 0) {
        // Remove data URI prefix if present, otherwise use as-is
        let cleanBase64 = invoicePdfBase64
        if (invoicePdfBase64.includes(',')) {
          // Has data URI prefix, extract base64 part
          cleanBase64 = invoicePdfBase64.split(',')[1]
        } else if (invoicePdfBase64.startsWith('data:')) {
          // Has data prefix but no comma (unlikely but handle it)
          cleanBase64 = invoicePdfBase64.replace(/^data:[^;]*;base64,/, '')
        }
        // If no prefix, use the string as-is (it's already base64)
        
        if (cleanBase64 && cleanBase64.length > 0) {
          attachment.push({
            filename: 'invoice.pdf',
            content: cleanBase64,
            encoding: 'base64',
          })
          console.log('✅ Added invoice PDF attachment (' + Math.round(cleanBase64.length / 1024) + 'KB)')
        } else {
          console.log('⚠️ Invoice PDF base64 is empty after cleaning')
        }
      } else {
        console.log('⚠️ Invoice PDF is empty or invalid')
      }
    } catch (e) {
      console.error('❌ Error processing invoice PDF attachment:', e.message)
      console.error('Error stack:', e.stack)
    }
  } else {
    console.log('⚠️ No invoice PDF in request')
  }
  
  console.log('📎 Total attachments:', attachment.length)
  attachment.forEach((att, idx) => {
    console.log(`  ${idx + 1}. ${att.filename} (${Math.round(att.content.length / 1024)}KB)`)
  })

  // Verify both PDFs are present
  const hasDesignPDF = attachment.some(a => a.filename === 'design.pdf')
  const hasInvoicePDF = attachment.some(a => a.filename === 'invoice.pdf')
  console.log('📄 PDF Verification:')
  console.log('  - Design PDF:', hasDesignPDF ? '✅ Present' : '❌ Missing')
  console.log('  - Invoice PDF:', hasInvoicePDF ? '✅ Present' : '❌ Missing')
  
  if (!hasDesignPDF && request.pdfBase64) {
    console.warn('⚠️ WARNING: Design PDF was in request but not added to attachments!')
  }
  if (!hasInvoicePDF && request.invoicePdfBase64) {
    console.warn('⚠️ WARNING: Invoice PDF was in request but not added to attachments!')
  }

  // Build HTML Content
  let configDetails = ''
  if (request.config?.category === 'name') {
    configDetails = `
      <div class="field"><span class="label">Text:</span> <span class="value accent">${request.config.text}</span></div>
      <div class="field"><span class="label">Font:</span> <span class="value">${request.config.font}</span></div>
      <div class="field"><span class="label">Color:</span> <span class="value" style="color: ${request.config.color}">${request.config.color}</span></div>
      <div class="field"><span class="label">Size:</span> <span class="value">${request.config.size}</span></div>
    `
  } else if (request.config?.category === 'logo') {
    configDetails = `
      <div class="field"><span class="label">Type:</span> <span class="value">Uploaded Logo</span></div>
      <div class="field"><span class="label">Backboard:</span> <span class="value">${request.config.frameShape || 'Standard'}</span></div>
      <div class="field"><span class="label">Color:</span> <span class="value" style="color: ${request.config.color}">${request.config.color}</span></div>
    `
  }

  const content = `
    <h2 style="margin-top: 0; font-size: 20px; font-weight: normal; margin-bottom: 20px; color: #ffffff;">New Custom Design Request</h2>
    
    <div class="card">
      <div class="card-title">Customer Details</div>
      <div class="field"><span class="label">Name:</span> <span class="value">${request.customerName}</span></div>
      <div class="field"><span class="label">Email:</span> <span class="value"><a href="mailto:${request.email}" style="color: #ffffff; text-decoration: none;">${request.email}</a></span></div>
      <div class="field"><span class="label">Phone:</span> <span class="value">${request.phone || 'N/A'}</span></div>
      ${request.notes ? `<div class="field"><span class="label">Notes:</span> <span class="value" style="display:block; margin-top:5px; color: #cccccc;">${request.notes}</span></div>` : ''}
    </div>

    <div class="card">
      <div class="card-title">Sign Specification</div>
      <div class="field"><span class="label">Category:</span> <span class="value">${request.config?.category?.toUpperCase()}</span></div>
      ${configDetails}
    </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666; font-size: 13px;">Attachments included: ${attachment.map(a => a.filename).join(', ') || 'None'}</p>
          ${attachment.some(a => a.filename === 'invoice.pdf') ? '<p style="color: #00ffff; font-size: 12px; margin-top: 5px;">📄 Invoice PDF included for customer records</p>' : ''}
        </div>
  `

  const html = getEmailTemplate('New Design Request', content)

  try {
    console.log('📤 Preparing to send email...')
    console.log('To:', process.env.DESIGNER_EMAIL)
    console.log('From:', process.env.SMTP_USER)
    console.log('Attachments:', attachment.length)
    console.log('Attachment files:', attachment.map(a => a.filename).join(', '))

    if (sgMail) {
      // SendGrid format - ensure all attachments are included
      const sendGridAttachments = attachment.map(a => ({
        content: a.content,
        filename: a.filename,
        type: a.filename.endsWith('.pdf') ? 'application/pdf' : 'image/png',
        disposition: 'attachment',
      }))
      
      console.log('📎 SendGrid attachments being sent:', sendGridAttachments.map(a => a.filename).join(', '))
      
      const msg = {
        to: process.env.DESIGNER_EMAIL,
        from: process.env.SMTP_USER || process.env.FROM_EMAIL || 'no-reply@masterneon.com',
        subject: `New Request: ${request.customerName}`,
        html,
        attachments: sendGridAttachments,
      }
      
      console.log('📤 Sending via SendGrid...')
      const result = await sgMail.send(msg)
      console.log('✅ Neon request email sent via SendGrid')
      console.log('SendGrid response status:', result[0]?.statusCode)
      console.log('📎 Attachments sent:', sendGridAttachments.length, 'files')
      return
    } else if (transporter) {
      // SMTP format - ensure all attachments are included
      const smtpAttachments = attachment.map(a => ({ 
        filename: a.filename, 
        content: Buffer.from(a.content, 'base64') 
      }))
      
      console.log('📎 SMTP attachments being sent:', smtpAttachments.map(a => a.filename).join(', '))
      
      const mailOptions = {
        from: `Master Neon Builder <${process.env.SMTP_USER}>`,
        to: process.env.DESIGNER_EMAIL,
        subject: `New Request: ${request.customerName}`,
        html,
        attachments: smtpAttachments.length > 0 ? smtpAttachments : undefined,
      }

      console.log('📤 Sending via SMTP...')
      const info = await transporter.sendMail(mailOptions)
      console.log('✅ Neon request email sent via SMTP')
      console.log('SMTP message ID:', info.messageId)
      console.log('📎 Attachments sent:', smtpAttachments.length, 'files')
      return
    } else {
      throw new Error('No email transport available (neither SendGrid nor SMTP configured)')
    }
  } catch (err) {
    console.error('❌ Error sending email:', err.message)
    console.error('Error details:', {
      name: err.name,
      code: err.code,
      response: err.response ? JSON.stringify(err.response) : undefined,
      stack: err.stack,
    })
    throw err
  }
}

// Background retry worker: attempts to resend any saved failed emails every minute
const processQueuedEmails = async () => {
  const emailsDir = path.join(__dirname, '..', '..', 'emails')
  try {
    if (!fs.existsSync(emailsDir)) return
    const files = fs.readdirSync(emailsDir).filter((f) => f.endsWith('.json'))
    if (files.length === 0) return
    console.log(`Found ${files.length} queued email(s). Attempting to resend one by one...`)
    for (const file of files) {
      const filePath = path.join(emailsDir, file)
      try {
        const raw = fs.readFileSync(filePath, 'utf8')
        const payload = JSON.parse(raw)
        const { html, attachments } = payload

        const attach = (attachments || []).map((a) => ({ filename: a.filename, content: a.content, encoding: a.encoding || 'base64' }))
        const attachWithContent = attach.filter((a) => a && a.content)

        if (sgMail) {
          const msg = {
            from: process.env.SMTP_USER || process.env.FROM_EMAIL || 'no-reply@masterneon.com',
            to: process.env.DESIGNER_EMAIL,
            subject: 'New Neon Custom Design Request (retry)',
            html,
            attachments: attachWithContent.map((a) => ({ content: a.content, filename: a.filename, type: 'application/octet-stream', disposition: 'attachment' })),
          }
          await sgMail.send(msg)
          console.log(`Resend succeeded via SendGrid for ${file}`)
          fs.unlinkSync(filePath)
        } else {
          await transporter.sendMail({
            from: `Master Neon Builder <${process.env.SMTP_USER}>`,
            to: process.env.DESIGNER_EMAIL,
            subject: 'New Neon Custom Design Request (retry)',
            html,
            attachments: attachWithContent.map((a) => ({ filename: a.filename, content: Buffer.from(a.content, 'base64') })),
          })
          console.log(`Resend succeeded via SMTP for ${file}`)
          fs.unlinkSync(filePath)
        }
      } catch (e) {
        console.error(`Resend failed for ${file}:`, e && e.message ? e.message : e)
      }
    }
  } catch (e) {
    console.error('Error processing queued emails:', e && e.message ? e.message : e)
  }
}

setTimeout(() => void processQueuedEmails(), 5 * 1000)
setInterval(() => void processQueuedEmails(), 60 * 1000)

const sendContactEmail = async (message) => {
  console.log('📧 sendContactEmail called')
  console.log('Email config check:', {
    hasSMTP_USER: !!process.env.SMTP_USER,
    hasSMTP_PASS: !!process.env.SMTP_PASS,
    hasDESIGNER_EMAIL: !!process.env.DESIGNER_EMAIL,
    hasSENDGRID_API_KEY: !!process.env.SENDGRID_API_KEY,
    hasTransporter: !!transporter,
    hasSendGrid: !!sgMail,
  })

  if (!isEmailConfigured()) {
    const errorMsg = 'Email not configured. Missing required environment variables: SMTP_USER, SMTP_PASS, DESIGNER_EMAIL, or SENDGRID_API_KEY'
    console.error('❌', errorMsg)
    throw new Error(errorMsg)
  }

  const content = `
    <h2 style="margin-top: 0; font-size: 20px; font-weight: normal; margin-bottom: 20px; color: #ffffff;">New Contact Message</h2>
    
    <div class="card">
      <div class="card-title">Sender Info</div>
      <div class="field"><span class="label">Name:</span> <span class="value">${message.name}</span></div>
      <div class="field"><span class="label">Email:</span> <span class="value"><a href="mailto:${message.email}" style="color: #ffffff;">${message.email}</a></span></div>
      <div class="field"><span class="label">Phone:</span> <span class="value">${message.phone || 'N/A'}</span></div>
    </div>

    <div class="card">
      <div class="card-title">Message</div>
      <div style="color: #ffffff; line-height: 1.6; white-space: pre-wrap;">${message.message}</div>
    </div>
  `

  const html = getEmailTemplate('New Contact Message', content)
  const recipientEmail = process.env.DESIGNER_EMAIL || process.env.ADMIN_EMAIL

  try {
    console.log('📤 Preparing to send contact email...')
    console.log('To:', recipientEmail)
    console.log('From:', process.env.SMTP_USER || 'SendGrid')

    if (sgMail) {
      // SendGrid format
      const msg = {
        to: recipientEmail,
        from: process.env.SMTP_USER || process.env.FROM_EMAIL || 'no-reply@masterneon.com',
        subject: `Contact: ${message.name}`,
        html,
      }
      
      console.log('📤 Sending via SendGrid...')
      const result = await sgMail.send(msg)
      console.log('✅ Contact email sent via SendGrid')
      console.log('SendGrid response status:', result[0]?.statusCode)
      return
    } else if (transporter) {
      // SMTP format
      const mailOptions = {
        from: `Master Neon Website <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: `Contact: ${message.name}`,
        html,
      }

      console.log('📤 Sending via SMTP...')
      const info = await transporter.sendMail(mailOptions)
      console.log('✅ Contact email sent via SMTP')
      console.log('SMTP message ID:', info.messageId)
      return
    } else {
      throw new Error('No email transport available (neither SendGrid nor SMTP configured)')
    }
  } catch (err) {
    console.error('❌ Error sending contact email:', err.message)
    console.error('Error details:', {
      name: err.name,
      code: err.code,
      response: err.response ? JSON.stringify(err.response) : undefined,
      stack: err.stack,
    })
    throw err
  }
}

module.exports = { sendNeonRequestEmail, sendContactEmail }
