// Health check endpoint
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

app.get('/', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

module.exports = app

