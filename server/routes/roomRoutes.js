const express = require('express')
const router = express.Router()
const cors = require('cors')
const { getRooms, roomCreate, addMemberToRoom, deleteRoom, updateRoom } = require('../controllers/roomControllers')

// Middleware
router.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))

router.get('/', getRooms)
router.post('/create', roomCreate)
router.post('/addMember', addMemberToRoom)
router.put('/update', updateRoom)
router.delete('/delete', deleteRoom)

module.exports = router;