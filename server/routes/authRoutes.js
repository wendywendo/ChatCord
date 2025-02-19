const express = require('express')
const router = express.Router()
const cors = require('cors')
const multer = require('multer')
const { 
    test, registerUser, loginUser, getProfile, logoutUser, getAllUsers, getUser, getProfilePic, uploadProfilePic
} = require('../controllers/authControllers')


// Configure multer storage
const storage = multer.memoryStorage()
const upload = multer({ storage })


// Middleware
router.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

router.get('/', test)
router.get('/users', getAllUsers)
router.get('/users/:id', getUser)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', getProfile)
router.post('/logout', logoutUser)
router.get('/profile-pic/:username', getProfilePic)
router.post('/upload-profile-pic', upload.single('profilePic'), uploadProfilePic)

module.exports = router