const User = require('../Models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { encryptDescriptor } = require('../utils/faceCrypto');
const register = async (req, res) => {
    const { name, email, password, jobTitle, faceDescriptor } = req.body;
    try {
        // Check duplicate
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 6 characters and include letters, numbers, and a special character"
            });
        }
        // Hash password before saving
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const encryptedDescriptor = faceDescriptor ? encryptDescriptor(faceDescriptor) : null;
        // Save to MongoDB
        const user = await User.create({ name, email, password: hashedPassword, jobTitle,faceDescriptor: encryptedDescriptor || null })

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, 'secret123', { expiresIn: '7d' })

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, jobTitle: user.jobTitle,faceDescriptor: faceDescriptor || null }
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