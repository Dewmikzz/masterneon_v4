require('dotenv').config()
const mongoose = require('mongoose')
;(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    const col = mongoose.connection.db.collection('neonrequests')
    const docs = await col.find({ email: 'pdftest@example.com' }).toArray()
    console.log('found:', docs.length)
    console.dir(docs, { depth: 1 })
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
