const express = require('express')
const router = express.Router();
const { register, loginUser } = require('../Controllers/authController')

router.post('/register', register).post('/login', loginUser)



module.exports = router