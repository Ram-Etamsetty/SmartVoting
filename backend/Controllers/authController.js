const User = require('../Models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const { name, email, password, jobTitle } = req.body
    try {
        // Check duplicate
        const existing = await User.findOne({ email })
        if (existing) {
            return res.status(400).json({ message: 'Email Already Exists' })
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Save to MongoDB
        const user = await User.create({ name, email, password: hashedPassword, jobTitle })

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, 'secret123', { expiresIn: '7d' })

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, jobTitle: user.jobTitle }
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const userAvailable = await User.findOne({ email })
        if (!userAvailable) {
            return res.status(400).json({ message: "User not Exists" })
        }

        const correctPassword = await bcrypt.compare(password, userAvailable.password)
        if (!correctPassword) {
            return res.status(400).json({ message: "Incorrect Password" })
        }

        const token = jwt.sign({ id: userAvailable._id }, 'secret123', { expiresIn: '7d' })

        res.status(200).json({
            token,
            user: { id: userAvailable._id, name: userAvailable.name, email: userAvailable.email, jobTitle: userAvailable.jobTitle }
        })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

module.exports = { register, loginUser }