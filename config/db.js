const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        //Additional properties no longer needed.
        const conn = await mongoose.connect(process.env.DB)

        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB