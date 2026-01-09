const express = require('express')
const { createNeonRequest } = require('../controllers/neonRequestController')

const router = express.Router()

router.post('/', createNeonRequest)

module.exports = router
