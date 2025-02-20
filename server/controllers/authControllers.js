const express = require('express')
const User = require('../models/User')
const { comparePassword, hashPassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken')


const test = (req, res) => {
    res.json({ "message": "Test is working!" })
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})

        return res.json(users)
    } catch (error) {
        console.log(error)
    }
}

const getUser = async (req, res) => {
    try {

        const { id } = req.params

        const user = await User.findOne({ _id: id })

        return res.json(user)
        
    } catch (error) {
        console.log(error)
    }
}

const registerUser = async (req, res) => {
    try {

        const { username, email, password } = req.body

        // Check if username is unique
        const existingUsername = await User.findOne({ username })
        if (existingUsername) {
            return res.json({ 
                error: "Username already exists" 
            })
        }

        // Check if email is unique
        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.json({
                error: "Email is already taken"
            })
        }

        // Check if password is good
        if (!password || password.length < 6) {
            return res.json({
                error: "Password is required and must be at least 6 characters long"
            })
        }

        const hashedPassword = await hashPassword(password)

        // Create user
        const user = await User.create({ 
            username, 
            email, 
            password: hashedPassword
        })
        
        return res.json(user)
        
    } catch (error) {
        console.log(error)
    }
}

const loginUser = async (req, res) => {
    try {
        
        const { email, password } = req.body

        // Check if user exists
        const user = await User.findOne({ email })

        if (!user) {
            return res.json({
                error: "User not found"
            })
        }

        // Check password
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.json({
                error: "Password incorrect"
            })
        }

        jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            }).json(user)
        })

    } catch (error) {
        console.log(error)
    }
}

const getProfile = async (req, res) => {
   
    const { token } = req.cookies

    if (!token) {
        res.json(nul)
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
        if (err) {
            console.error(err);
            return res.status(401).json({ error: 'Token verification failed' });
        }

        const user = await User.findById(data.id)

        res.json(user)
    })
}


// Upload profilePic
const uploadProfilePic = async (req, res) => {
    try {
        
        const { userId } = req.body

        console.log(userId)

        const user = await User.findById(userId)
        if (!user) {
            return res.json({ error: `User not found: ${userId}` })
        }

        const { mimetype, buffer } = req.file
        user.profilePic = buffer
        user.profilePicType = mimetype
        await user.save()

        res.json({ success: "Profile pic uploaded successfully!" })
    } catch (error) {
        res.json({ error: 'Error uploading profile pic' })
    }   
}

// Get profile pic
const getProfilePic = async (req, res) => {
    try {

        const { username } = req.params

        const user = await User.findOne({ username })

        if (!user) {
            return res.json({ error: 'User not found!' })
        }

        if (!user.profilePic) {
            return null
        }

        res.contentType(user.profilePicType)
        res.send(user.profilePic)

    } catch (error) {
        res.json({ error: 'Error retrieving profile picture' })
    }
}


const logoutUser = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    }).json({ message: 'Logged out successfully!' });
}


module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
    getAllUsers,
    getUser,
    getProfilePic,
    uploadProfilePic
}