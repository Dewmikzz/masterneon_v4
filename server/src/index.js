require('dotenv').config()
const connectDatabase = require('./config/db')
const app = require('./app')

const PORT = process.env.PORT || 5000

const startServer = async () => {
  // Check if email is configured (optional, will log warnings if not)
  const hasEmailConfig =
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.DESIGNER_EMAIL &&
    !process.env.SMTP_USER.includes('your_') &&
    !process.env.SMTP_PASS.includes('your_')

  if (!hasEmailConfig) {
    console.log('⚠️  Email not configured. The server will run but emails will not be sent.')
    console.log('   Set SMTP_USER, SMTP_PASS, and DESIGNER_EMAIL in your .env file to enable email notifications.')
  }

  // Connect to database first (if configured)
  if (process.env.MONGO_URI) {
    await connectDatabase()
  }

  app.listen(PORT, () => {
    console.log(`🚀 Master Neon API running on port ${PORT}`)
    console.log(`📧 Email notifications: ${hasEmailConfig ? 'Enabled' : 'Disabled'}`)
  })
}

startServer()
