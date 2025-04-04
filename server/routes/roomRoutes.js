const express = require('express')
const router = express.Router()
const cors = require('cors')
const { getRooms, roomCreate, addMemberToRoom, deleteRoom, updateRoom } = require('../controllers/roomControllers')

// Middleware
router.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}))

router.get('/', getRooms)
router.post('/create', roomCreate)
router.post('/addMember', addMemberToRoom)
router.put('/update', updateRoom)
router.delete('/delete', deleteRoom)

module.exports = router;