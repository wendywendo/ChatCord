const mongoose = require('mongoose')
const { Schema } = mongoose

const roomSchema = Schema({
    name: String,
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
})

// When a room is created, admin is automatically a member
roomSchema.pre('save', function(next) {
    if (!this.members.includes(this.admin)) {
        this.members = [this.admin]
    }
    next();
})

const RoomModel = mongoose.model('Room', roomSchema)

module.exports = RoomModel