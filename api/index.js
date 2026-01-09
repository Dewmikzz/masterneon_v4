// Vercel serverless function - main API handler
require('dotenv').config()
const app = require('../server/src/app')

// Export the Express app for Vercel
module.exports = app

