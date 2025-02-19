const fs = require('fs')
const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String, 
        unique: true
    },
    password: String,
    profilePic: Buffer,
    profilePicType: { type: String, default: 'image/png' }
})

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel