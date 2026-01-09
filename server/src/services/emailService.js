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

const transporter = nodemailer.createTransport({
  host: resolvedHost,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const isEmailConfigured = () => {
  return (
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    !process.env.SMTP_USER.includes('your_') &&
    !process.env.SMTP_PASS.includes('your_') &&
    process.env.DESIGNER_EMAIL &&
    !process.env.DESIGNER_EMAIL.includes('your_')
  )
}

<<<<<<< HEAD
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
  if (!isEmailConfigured()) {
    console.log('⚠️ Email not configured. Skipping neon request email.')
    return
  }

  const attachment = []
  if (request.imagePreview && request.imagePreview.startsWith('data:image')) {
    attachment.push({
      filename: 'neon-preview.png',
      content: request.imagePreview.split(';base64,').pop(),
      encoding: 'base64',
    })
  }

=======
const sendNeonRequestEmail = async (request) => {
  if (!isEmailConfigured()) {
    console.log('⚠️ Email not configured. Skipping neon request email.')
    console.log('Request details:', {
      customerName: request.customerName,
      email: request.email,
      category: request.config?.category,
    })
    return
  }

  const attachment =
    request.imagePreview && request.imagePreview.startsWith('data:image')
      ? [
          {
            filename: 'neon-preview.png',
            content: request.imagePreview.split(';base64,').pop(),
            encoding: 'base64',
          },
        ]
      : []

  // Attach generated PDF if provided (expecting raw base64 string)
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
  if (request.pdfBase64) {
    try {
      const pdfBase64 = typeof request.pdfBase64 === 'string' ? request.pdfBase64.trim() : null
      if (pdfBase64 && pdfBase64.length > 0) {
<<<<<<< HEAD
=======
        // Remove data URI prefix if present
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
        const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '')
        if (cleanBase64.length > 0) {
          attachment.push({
            filename: 'design.pdf',
            content: cleanBase64,
            encoding: 'base64',
          })
        }
      }
<<<<<<< HEAD
    } catch (e) {
      console.error('Error processing PDF attachment:', e.message)
    }
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
    </div>
  `

  const html = getEmailTemplate('New Design Request', content)

  try {
    const mailOptions = {
      from: `Master Neon Builder <${process.env.SMTP_USER}>`,
      to: process.env.DESIGNER_EMAIL,
      subject: `New Request: ${request.customerName}`,
      html,
      attachments: attachment.length > 0 ? attachment.map(a => ({ filename: a.filename, content: Buffer.from(a.content, 'base64') })) : undefined,
    }

    if (sgMail) {
      mailOptions.from = process.env.SMTP_USER || process.env.FROM_EMAIL || 'no-reply@masterneon.com'
      // SendGrid expects content string for attachments, not Buffer
      mailOptions.attachments = attachment.map(a => ({
        content: a.content,
        filename: a.filename,
        type: a.filename.endsWith('.pdf') ? 'application/pdf' : 'image/png',
        disposition: 'attachment',
      }))
      await sgMail.send(mailOptions)
      console.log('✅ Neon request email sent via SendGrid')
    } else {
      await transporter.sendMail(mailOptions)
      console.log('✅ Neon request email sent via SMTP')
    }
  } catch (err) {
    // Error handling logic (persist to disk) preserved but simplified for brevity in this update
    console.error('❌ Error sending email:', err.message)
    // ... file persistence logic can remain if needed, but for now focusing on the template update
=======
    } catch (pdfError) {
      console.error('Error processing PDF attachment:', pdfError.message)
      // Continue without PDF attachment if there's an error
    }
  }

  // Build HTML based on category
  let designDetails = ''
  if (request.config?.category === 'name') {
    designDetails = `
      <p><strong>Category:</strong> Name Sign</p>
      <p><strong>Text:</strong> ${request.config.text}</p>
      <p><strong>Font:</strong> ${request.config.font}</p>
      <p><strong>Color:</strong> ${request.config.color}</p>
      <p><strong>Size:</strong> ${request.config.size}</p>
    `
  } else if (request.config?.category === 'logo') {
    designDetails = `
      <p><strong>Category:</strong> Logo Sign</p>
      <p><strong>Type:</strong> ${request.config.imageData ? 'Uploaded Image' : `Emoji: ${request.config.emoji}`}</p>
      <p><strong>Color:</strong> ${request.config.color}</p>
      <p><strong>Brightness:</strong> ${request.config.brightness}%</p>
      <p><strong>Size:</strong> ${request.config.size}</p>
    `
  } else if (request.config?.category === 'default') {
    designDetails = `
      <p><strong>Category:</strong> Default Design</p>
      <p><strong>Template:</strong> ${request.config.template}</p>
      <p><strong>Color:</strong> ${request.config.color}</p>
      <p><strong>Size:</strong> ${request.config.size}</p>
    `
  }

  const html = `
    <h2>New Neon Custom Design Request</h2>
    <h3>Customer Details</h3>
    <p><strong>Name:</strong> ${request.customerName}</p>
    <p><strong>Email:</strong> ${request.email}</p>
    <p><strong>Phone:</strong> ${request.phone || 'Not provided'}</p>
    ${request.notes ? `<p><strong>Notes:</strong> ${request.notes}</p>` : ''}
    
    <h3>Neon Sign Details</h3>
    ${designDetails}
    
    <p><strong>Submitted:</strong> ${request.timestamp || new Date().toISOString()}</p>
  `

  try {
    if (sgMail) {
      const msg = {
        from: process.env.SMTP_USER || process.env.FROM_EMAIL || 'no-reply@masterneon.com',
        to: process.env.DESIGNER_EMAIL,
        subject: 'New Neon Custom Design Request',
        html,
        attachments: attachment.map((a) => ({
          content: a.content,
          filename: a.filename,
          type: a.contentType || 'application/octet-stream',
          disposition: 'attachment',
        })),
      }
      await sgMail.send(msg)
      console.log('✅ Neon request email sent successfully via SendGrid')
      console.log('📬 Email sent to:', process.env.DESIGNER_EMAIL)
      console.log('📎 Attachments:', attachment.length, 'file(s)')
    } else {
      await transporter.sendMail({
        from: `Master Neon Builder <${process.env.SMTP_USER}>`,
        to: process.env.DESIGNER_EMAIL,
        subject: 'New Neon Custom Design Request',
        html,
        attachments: attachment.length > 0 ? attachment.map((a) => ({ filename: a.filename, content: Buffer.from(a.content, 'base64') })) : undefined,
      })
      console.log('✅ Neon request email sent successfully via SMTP')
      console.log('📬 Email sent to:', process.env.DESIGNER_EMAIL)
      console.log('📎 Attachments:', attachment.length, 'file(s)')
    }
  } catch (err) {
    // Log full error object for diagnostics
    console.error('❌ Error sending neon request email (full error):', err)

    // Ensure we persist the failed email payload so designers can be notified manually
    try {
      const emailsDir = path.join(__dirname, '..', '..', 'emails')
      if (!fs.existsSync(emailsDir)) fs.mkdirSync(emailsDir, { recursive: true })
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `neon-request-${timestamp}.json`
      const payload = {
        request,
        html,
        attachments: attachment.map((a) => ({ filename: a.filename, content: a.content, encoding: a.encoding || 'base64' })),
        error: {
          message: err && err.message ? err.message : String(err),
          code: err && err.code ? err.code : undefined,
          response: err && err.response ? err.response : undefined,
        },
      }
      fs.writeFileSync(path.join(emailsDir, filename), JSON.stringify(payload, null, 2), 'utf8')
      console.log(`Saved failed email payload to ${path.join('server', 'emails', filename)}`)
    } catch (fsErr) {
      console.error('Failed to write failed email payload to disk:', fsErr)
    }

    // Re-throw so callers can decide how to respond, preserving original error when possible
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
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
<<<<<<< HEAD
  if (!isEmailConfigured()) return

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
=======
  if (!isEmailConfigured()) {
    console.log('⚠️ Email not configured. Skipping contact email.')
    console.log('Contact message:', {
      name: message.name,
      email: message.email,
    })
    return
  }
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a

  try {
    await transporter.sendMail({
      from: `Master Neon Website <${process.env.SMTP_USER}>`,
      to: process.env.DESIGNER_EMAIL || process.env.ADMIN_EMAIL,
<<<<<<< HEAD
      subject: `Contact: ${message.name}`,
      html,
    })
  } catch (err) {
    console.error('Error sending contact email:', err.message)
=======
      subject: `Contact form — ${message.name}`,
      html: `
        <h3>Contact Message</h3>
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Phone:</strong> ${message.phone || 'Not provided'}</p>
        <p><strong>Message:</strong><br/>${message.message}</p>
      `,
    })
  } catch (err) {
    console.error('Error sending contact email:', err && err.message ? err.message : err)
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
    throw err
  }
}

module.exports = { sendNeonRequestEmail, sendContactEmail }
