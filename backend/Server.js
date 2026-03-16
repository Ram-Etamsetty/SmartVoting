const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./Config/db')

connectDB()

const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))


app.use(express.json())
app.use('/api/auth', require('./Routes/auth'))
app.use('/api/elections', require('./Routes/electionRoutes'))

app.listen(process.env.PORT, () => {
    console.log('✅ Server Started on port' + process.env.PORT)
})