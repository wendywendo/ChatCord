const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true })

const MessageModel = mongoose.model('Message', messageSchema)

module.exports = MessageModel