const http = require('http')

const data = JSON.stringify({
  customerName: 'Test User',
  email: 'test@example.com',
  config: { category: 'name', text: 'Hello', font: 'Arial', color: '#fff', size: 'medium' }
})

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/neon-request',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}

const req = http.request(options, (res) => {
  let body = ''
  res.on('data', (chunk) => { body += chunk })
  res.on('end', () => {
    console.log('Status:', res.statusCode)
    console.log('Body:', body)
  })
})

req.on('error', (e) => {
  console.error('Request error:', e)
})

req.write(data)
req.end()
