require('dotenv').config()
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const app = express()
const cors = require('cors')

// DB connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Database connected"))
.catch((err) => console.log("Database not connected: ", err))

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))


app.use('/', require('./routes/authRoutes'))
app.use('/rooms', require('./routes/roomRoutes'))
app.use('/messages', require('./routes/messageRoutes'))

const server = http.createServer(app)
const io = socketio(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
})

io.use((socket, next) => {
    try {   
        const token = socket.handshake.headers.cookie
            ?.split('; ')
            ?.find(row => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) throw new Error("No token provided");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();

    } catch (error) {
        console.log("Socket Authentication Error:", error.message);
        next(new Error("Authentication error"));
    }
});


io.on('connection', (socket) => {

    socket.on('joinRoom', (room) => {

        socket.join(room)

        socket.emit("message", "Welcome to Chat App!")

    })

    socket.on("chatMessage", async (user, msg, room) => {

        io.to(room).emit("message", {
            from: user,
            room,
            message: msg,
        })
    })

    socket.on("typing", (room) => {
        socket.broadcast.to(room).emit("typing", socket.user.username)
    })

    socket.on("stopTyping", (room) => {
        socket.broadcast.to(room).emit("stopTyping")
    })

})


const PORT = process.env.PORT || 8000

server.listen(PORT, () => console.log(`Server is running at port ${PORT}`))