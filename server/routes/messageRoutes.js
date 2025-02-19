const express = require('express')
const router = express.Router()
const cors = require('cors')
const { getAllMessages, createMessage } = require('../controllers/messagesController')

// Middleware
router.use(cors({
    credentials: true,
    origin: 'https://chat-cord-iota.vercel.app'
}))

router.post('/', getAllMessages)
router.post('/create', createMessage)

module.exports = router;