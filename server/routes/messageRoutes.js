const express = require('express')
const router = express.Router()
const cors = require('cors')
const { getAllMessages, createMessage } = require('../controllers/messagesController')

// Middleware
router.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))

router.post('/', getAllMessages)
router.post('/create', createMessage)

module.exports = router;