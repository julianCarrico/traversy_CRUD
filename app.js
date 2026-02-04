const express = require('express')
const app = express()
const dotenv = require('dotenv')
const connectDB = require('./config/db')
dotenv.config({ path: './config/config.env' })

connectDB()

const PORT = process.env.PORT || 8000

app.listen(PORT, console.log(`server running on ${process.env.NODE_ENV} mode on PORT ${PORT}`))