const express = require('express')
const Message = require('../models/Message')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const Room = require('../models/Room')

// Get all messages from logged in user in a certain room
const getAllMessages = async (req, res) => {

    const { roomName } = req.body
    
    // Find logged in user
    const { token } = req.cookies
    let userEmail;

    if (!token) {
        return res.json({ error: 'No user logged in' })
    }
    
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
        if (err) throw err
        userEmail = user.email
    })

    const user = await User.findOne({ email: userEmail })

    if (!user) {
        return res.json({ error: "No user found" })
    }

    // Get room
    const room = await Room.findOne({ name: roomName })
    if (!room) {
        return res.json({ error: "No such room exists" })
    }

    // Get all messages
    const messages = await Message.find({ room }).populate('from', 'username')
    res.json(messages)

}


const createMessage = async (req, res) => {
    const { messageTxt, roomName } = req.body

    // Find user
    const { token } = req.cookies
    let userEmail;

    if (!token) {
        return res.json({ error: 'No user logged in' })
    }
    
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
        if (err) throw err
        userEmail = user.email
    })

    const user = await User.findOne({ email: userEmail })

    if (!user) {
        return res.json({ error: "No user found" })
    }

    // Find room
    const room = await Room.findOne({ name: roomName })
    if (!room) {
        return res.json({ error: "No such room exists" })
    }

    // Create message
    const message = await Message.create({
        from: user,
        room,
        message: messageTxt
    })

    res.json(message)

}

module.exports = {
    getAllMessages,
    createMessage
}