const express = require('express')
const Room = require('../models/Room')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const getRooms = async (req, res) => {

    const { token } = req.cookies
    let userEmail;

    if (!token) {
        return res.json({
            error: 'No user logged in'
        })
    }
    
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
        if (err) throw err
        userEmail = user.email
    })

    const user = await User.findOne({ email: userEmail })

    if (!user) {
        return res.json({
            error: "No user found"
        })
    }

    const rooms = await Room.find({ members: user._id })

    return res.json(rooms)
}

const roomCreate = async (req, res) => {
    try {
        
        const { name } = req.body;
        const { token } = req.cookies
        let userEmail;

        if (!token) {
            return res.json({
                error: 'No user logged in'
            })
        }
        
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err
            userEmail = user.email
        })

        const admin = await User.findOne({ email: userEmail })

        if (!admin) {
            return res.json({
                error: "No user found"
            })
        }

        const room = await Room.create({ name, admin: admin._id })

        return res.json(room)

    } catch (error) {
        console.log(error)
    }
}

// Update room
const updateRoom = async (req, res) => {
    try {

        const { oldName, newName } = req.body

        const room = await Room.findOneAndUpdate(
            { name: oldName },
            { name: newName },
            { new: true }
        )

        if (!room) {
            return res.json({ error: "Room not found!" })
        }
        
        return res.json(room)
        
    } catch (error) {
        return res.json({ error: 'Internal Server error' })
    }
}


// Delete room
const deleteRoom = async (req, res) => {
    try {

        const { name } = req.query
        
        const result = await Room.deleteOne({ name });

        if (result.deletedCount === 0) {
            return res.json({ error: "Room not found" });
        }

        return res.json({ success: "Room successfully deleted" });

    } catch (error) {
        console.error("Error deleting room:", error);
        return res.json({ error: "Internal server error" });
    }
}

const addMemberToRoom = async (req, res) => {
    try {
        
        const { roomName, userEmail } = req.body

        const user = await User.findOne({ email: userEmail })
        if (!user) {
            return res.json({
                error: "User does not exist"
            })
        }

        const room = await Room.findOne({ name: roomName })
        if (!room) {
            return res.json({
                error: "Room does not exist"
            })
        }

        if (!room.members.includes(user._id)) {
            room.members.push(user._id)
            await room.save()
            return res.json({ success: "User added to room" })
        } else {
            return res.json({ error: "User is already a member of the room" })
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getRooms,
    roomCreate,
    addMemberToRoom,
    deleteRoom,
    updateRoom
}