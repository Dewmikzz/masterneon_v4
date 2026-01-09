const http = require('http')

function test(name, method, endpoint, data) {
  return new Promise((resolve) => {
    console.log(`\n${name}...`)
    const opts = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${endpoint}`,
      method,
      headers: { 'Content-Type': 'application/json' },
    }
    const req = http.request(opts, (res) => {
      let body = ''
      res.on('data', (chunk) => (body += chunk))
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`)
        console.log(`Body: ${body}`)
        resolve()
      })
    })
    req.on('error', (err) => {
      console.log(`Error: ${err.message || err.code}`)
      console.log(err)
      resolve()
    })
    req.setTimeout(5000)
    if (data) req.write(JSON.stringify(data))
    req.end()
  })
}

async function run() {
  console.log('Contact Endpoint Tests\n' + '='.repeat(50))

  await test('Test 1: Valid contact', 'POST', '/contact', {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    message: 'I would like a neon sign',
  })

  await test('Test 2: Missing email', 'POST', '/contact', {
    name: 'Jane Doe',
    message: 'Test message',
  })

  await test('Test 3: Missing message', 'POST', '/contact', {
    name: 'Bob Smith',
    email: 'bob@example.com',
  })

  console.log('\n' + '='.repeat(50))
  console.log('Tests complete')
  process.exit(0)
}

run()
