require('dotenv').config()
const nodemailer = require('nodemailer')

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

async function runDiagnostic() {
  console.log('SMTP_HOST:', resolvedHost)
  console.log('SMTP_PORT:', process.env.SMTP_PORT)
  console.log('SMTP_USER:', process.env.SMTP_USER)
  console.log('DESIGNER_EMAIL:', process.env.DESIGNER_EMAIL)
  console.log('secure:', Number(process.env.SMTP_PORT) === 465)

  try {
    console.log('\nVerifying transporter connection (this may take a few seconds)...')
    await transporter.verify()
    console.log('✅ Transporter verification succeeded')
  } catch (verifyErr) {
    console.error('❌ Transporter verification failed:')
    console.error(verifyErr)
  }

  try {
    console.log('\nAttempting to send a test email...')
    const info = await transporter.sendMail({
      from: `Diagnostic <${process.env.SMTP_USER}>`,
      to: process.env.DESIGNER_EMAIL || process.env.SMTP_USER,
      subject: 'Master Neon — SMTP Diagnostic',
      text: `This is a diagnostic message sent at ${new Date().toISOString()}\nIf you received this, SMTP works.`,
    })
    console.log('✅ Test email sent. MessageId:', info && info.messageId)
    if (info && info.response) console.log('SMTP response:', info.response)
  } catch (sendErr) {
    console.error('❌ Sending test email failed:')
    console.error(sendErr)
    if (sendErr.code) console.error('Code:', sendErr.code)
    if (sendErr.response) console.error('Response:', sendErr.response)
  }
}

runDiagnostic()
